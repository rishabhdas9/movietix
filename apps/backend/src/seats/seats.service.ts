import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { LockSeatsDto } from './dto/lock-seats.dto';
import { ReleaseSeatsDto } from './dto/release-seats.dto';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) {}

  async getAvailability(showId: string) {
    // First, clean up expired locks and bookings
    await this.cleanupExpiredLocks();
    await this.cleanupExpiredBookings();

    const show = await this.prisma.client.show.findUnique({
      where: { id: showId },
      include: {
        screen: {
          include: {
            seats: {
              where: {
                isActive: true,
              },
              orderBy: [{ row: 'asc' }, { column: 'asc' }],
            },
          },
        },
      },
    });

    if (!show) {
      throw new NotFoundException('Show not found');
    }

    // Get all booked seats for this show (CONFIRMED and PENDING only, not EXPIRED)
    const bookedSeats = await this.prisma.client.bookingSeat.findMany({
      where: {
        booking: {
          showId,
          status: {
            in: ['CONFIRMED', 'PENDING'],
          },
        },
      },
      select: {
        seatId: true,
      },
    });

    const bookedSeatIds = new Set(bookedSeats.map((bs) => bs.seatId));

    // Get all locked seats for this show
    const lockedSeats = await this.prisma.client.seatLock.findMany({
      where: {
        showId,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        seatId: true,
        sessionId: true,
      },
    });

    const lockedSeatMap = new Map(
      lockedSeats.map((ls) => [ls.seatId, ls.sessionId]),
    );

    // Map seat availability
    const seats = show.screen.seats.map((seat) => {
      let status = 'available';
      let lockedBy: string | null = null;

      if (bookedSeatIds.has(seat.id)) {
        status = 'booked';
      } else if (lockedSeatMap.has(seat.id)) {
        status = 'locked';
        lockedBy = lockedSeatMap.get(seat.id) ?? null;
      }

      return {
        id: seat.id,
        seatNumber: seat.seatNumber,
        row: seat.row,
        column: seat.column,
        seatType: seat.seatType,
        status,
        lockedBy,
      };
    });

    return {
      show: {
        id: show.id,
        startTime: show.startTime,
        pricing: show.pricing,
      },
      screen: {
        name: show.screen.name,
        layout: show.screen.layout,
      },
      seats,
    };
  }

  async lockSeats(lockSeatsDto: LockSeatsDto) {
    const { showId, seatIds, sessionId } = lockSeatsDto;

    // Clean up expired locks first
    await this.cleanupExpiredLocks();

    // Use a transaction to prevent race conditions when locking seats
    return await this.prisma.client.$transaction(async (tx) => {
      // Check if show exists
      const show = await tx.show.findUnique({
        where: { id: showId },
      });

      if (!show) {
        throw new NotFoundException('Show not found');
      }

      // Check if seats are already booked
      const bookedSeats = await tx.bookingSeat.findMany({
        where: {
          seatId: {
            in: seatIds,
          },
          booking: {
            showId,
            status: {
              in: ['CONFIRMED', 'PENDING'],
            },
          },
        },
      });

      if (bookedSeats.length > 0) {
        throw new BadRequestException('Some seats are already booked');
      }

      // Check if seats are locked by someone else
      const existingLocks = await tx.seatLock.findMany({
        where: {
          showId,
          seatId: {
            in: seatIds,
          },
          sessionId: {
            not: sessionId,
          },
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (existingLocks.length > 0) {
        throw new BadRequestException('Some seats are locked by another user');
      }

      // Release any existing locks for this session
      await tx.seatLock.deleteMany({
        where: {
          sessionId,
        },
      });

      // Create new locks (5 minutes expiry - matches booking expiry)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const locks = await Promise.all(
        seatIds.map((seatId) =>
          tx.seatLock.create({
            data: {
              showId,
              seatId,
              sessionId,
              expiresAt,
            },
          }),
        ),
      );

      return {
        success: true,
        expiresAt,
        lockedSeats: locks.length,
      };
    });
  }

  async releaseSeats(releaseSeatsDto: ReleaseSeatsDto) {
    const { sessionId } = releaseSeatsDto;

    await this.prisma.client.seatLock.deleteMany({
      where: {
        sessionId,
      },
    });

    return {
      success: true,
      message: 'Seats released',
    };
  }

  private async cleanupExpiredLocks() {
    await this.prisma.client.seatLock.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }

  private async cleanupExpiredBookings() {
    await this.prisma.client.booking.updateMany({
      where: {
        status: 'PENDING',
        expiresAt: {
          lt: new Date(),
        },
      },
      data: {
        status: 'EXPIRED',
      },
    });
  }
}

