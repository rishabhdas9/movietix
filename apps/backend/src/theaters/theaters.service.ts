import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TheatersService {
  constructor(private prisma: PrismaService) {}

  async findAll(city?: string) {
    const where = city ? { city } : {};

    const theaters = await this.prisma.client.theater.findMany({
      where,
      include: {
        screens: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return theaters;
  }

  async getCities() {
    const theaters = await this.prisma.client.theater.findMany({
      distinct: ['city'],
      select: {
        city: true,
      },
      orderBy: {
        city: 'asc',
      },
    });

    return theaters.map((t) => t.city);
  }
}


