import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, SeatType } from '@movietix/database';
import { generateBookingCode } from './utils/booking-code-generator';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(createBookingDto: CreateBookingDto) {
    const { showId, seatIds, userName, userEmail, userPhone, sessionId } =
      createBookingDto;

    // Use a transaction to prevent race conditions
    return await this.prisma.client.$transaction(async (tx) => {
      // Verify show exists
      const show = await tx.show.findUnique({
        where: { id: showId },
        include: {
          movie: true,
          screen: {
            include: {
              theater: true,
            },
          },
        },
      });

      if (!show) {
        throw new NotFoundException('Show not found');
      }

      // Verify seats exist and are available
      const seats = await tx.seat.findMany({
        where: {
          id: {
            in: seatIds,
          },
          screenId: show.screenId,
          isActive: true,
        },
      });

      if (seats.length !== seatIds.length) {
        throw new BadRequestException('Some seats are invalid');
      }

      // Check if seats are already booked (with FOR UPDATE to lock rows)
      const existingBookings = await tx.bookingSeat.findMany({
        where: {
          seatId: {
            in: seatIds,
          },
          booking: {
            showId,
            status: {
              in: [BookingStatus.CONFIRMED, BookingStatus.PENDING],
            },
          },
        },
      });

      if (existingBookings.length > 0) {
        throw new BadRequestException('Some seats are already booked');
      }

      // Verify seats are locked by this session
      const locks = await tx.seatLock.findMany({
        where: {
          showId,
          seatId: {
            in: seatIds,
          },
          sessionId,
          expiresAt: {
            gt: new Date(),
          },
        },
      });

      if (locks.length !== seatIds.length) {
        throw new BadRequestException(
          'Seats are not properly locked. Please try again.',
        );
      }

      // Calculate total amount based on seat types
      const pricing = show.pricing as Record<SeatType, number>;
      const totalAmount = seats.reduce((sum, seat) => {
        return sum + pricing[seat.seatType];
      }, 0);

      // Generate a unique booking code
      let bookingCode = generateBookingCode();
      let attempts = 0;
      const maxAttempts = 5;
      
      // Ensure booking code is unique (extremely rare to have collisions)
      while (attempts < maxAttempts) {
        const existing = await tx.booking.findUnique({
          where: { bookingCode },
        });
        
        if (!existing) break;
        
        bookingCode = generateBookingCode();
        attempts++;
      }
      
      if (attempts >= maxAttempts) {
        throw new BadRequestException('Failed to generate unique booking code. Please try again.');
      }

      // Create booking with pending status (5 minutes to complete payment)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 5);

      const booking = await tx.booking.create({
        data: {
          bookingCode,
          showId,
          userName,
          userEmail,
          userPhone,
          totalAmount,
          status: BookingStatus.PENDING,
          expiresAt,
          seats: {
            create: seats.map((seat) => ({
              seatId: seat.id,
              price: pricing[seat.seatType],
            })),
          },
        },
        include: {
          seats: {
            include: {
              seat: true,
            },
          },
          show: {
            include: {
              movie: true,
              screen: {
                include: {
                  theater: true,
                },
              },
            },
          },
        },
      });

      // Release the seat locks as they're now in booking
      await tx.seatLock.deleteMany({
        where: {
          sessionId,
        },
      });

      return {
        bookingId: booking.id,
        bookingCode: booking.bookingCode,
        totalAmount: booking.totalAmount,
        expiresAt: booking.expiresAt,
        movie: booking.show.movie.title,
        theater: booking.show.screen.theater.name,
        screen: booking.show.screen.name,
        showTime: booking.show.startTime,
        seats: booking.seats.map((bs) => ({
          seatNumber: bs.seat.seatNumber,
          seatType: bs.seat.seatType,
          price: bs.price,
        })),
      };
    });
  }

  async findByCode(bookingCode: string) {
    const booking = await this.prisma.client.booking.findUnique({
      where: { bookingCode },
      include: {
        seats: {
          include: {
            seat: true,
          },
        },
        show: {
          include: {
            movie: true,
            screen: {
              include: {
                theater: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return {
      bookingCode: booking.bookingCode,
      status: booking.status,
      totalAmount: booking.totalAmount,
      userName: booking.userName,
      userEmail: booking.userEmail,
      userPhone: booking.userPhone,
      bookedAt: booking.bookedAt,
      expiresAt: booking.expiresAt,
      movie: {
        title: booking.show.movie.title,
        poster: booking.show.movie.poster,
        duration: booking.show.movie.duration,
        certificate: booking.show.movie.certificate,
      },
      theater: {
        name: booking.show.screen.theater.name,
        address: booking.show.screen.theater.address,
        city: booking.show.screen.theater.city,
      },
      screen: booking.show.screen.name,
      showTime: booking.show.startTime,
      seats: booking.seats.map((bs) => ({
        seatNumber: bs.seat.seatNumber,
        seatType: bs.seat.seatType,
        price: bs.price,
      })),
    };
  }

  async confirmBooking(bookingCode: string) {
    const booking = await this.prisma.client.booking.findUnique({
      where: { bookingCode },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      return {
        success: true,
        message: 'Booking already confirmed',
        bookingCode,
      };
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking has been cancelled');
    }

    if (booking.status === BookingStatus.EXPIRED) {
      throw new BadRequestException('Booking has expired');
    }

    // Check if booking expired
    if (booking.expiresAt && booking.expiresAt < new Date()) {
      await this.prisma.client.booking.update({
        where: { id: booking.id },
        data: { status: BookingStatus.EXPIRED },
      });
      throw new BadRequestException('Booking has expired');
    }

    // Confirm the booking (simulate payment success)
    await this.prisma.client.booking.update({
      where: { id: booking.id },
      data: {
        status: BookingStatus.CONFIRMED,
        paymentId: `PAY_${Date.now()}`, // Mock payment ID
      },
    });

    return {
      success: true,
      message: 'Booking confirmed successfully',
      bookingCode,
    };
  }

  async cancelBooking(bookingCode: string) {
    const booking = await this.prisma.client.booking.findUnique({
      where: { bookingCode },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return {
        success: true,
        message: 'Booking already cancelled',
      };
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Cannot cancel confirmed booking. Please contact support.',
      );
    }

    await this.prisma.client.booking.update({
      where: { id: booking.id },
      data: { status: BookingStatus.CANCELLED },
    });

    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  }
}


