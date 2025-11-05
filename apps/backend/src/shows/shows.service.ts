import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ShowsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const show = await this.prisma.client.show.findUnique({
      where: { id },
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

    return show;
  }
}


