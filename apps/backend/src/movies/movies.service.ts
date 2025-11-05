import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    city?: string;
    genre?: string;
    language?: string;
  }) {
    const where: any = {
      isActive: true,
    };

    // Filter by genre
    if (filters.genre) {
      where.genre = {
        has: filters.genre,
      };
    }

    // Filter by language
    if (filters.language) {
      where.language = {
        has: filters.language,
      };
    }

    // If city is provided, only show movies that have shows in that city
    if (filters.city) {
      where.shows = {
        some: {
          screen: {
            theater: {
              city: filters.city,
            },
          },
          isActive: true,
        },
      };
    }

    const movies = await this.prisma.client.movie.findMany({
      where,
      orderBy: {
        rating: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        poster: true,
        genre: true,
        language: true,
        rating: true,
        duration: true,
        certificate: true,
        releaseDate: true,
      },
    });

    return movies;
  }

  async findBySlug(slug: string) {
    const movie = await this.prisma.client.movie.findUnique({
      where: { slug, isActive: true },
      include: {
        shows: {
          where: {
            isActive: true,
            startTime: {
              gte: new Date(),
            },
          },
          include: {
            screen: {
              include: {
                theater: true,
              },
            },
          },
          take: 10,
        },
      },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with slug '${slug}' not found`);
    }

    return movie;
  }

  async getShowsForMovie(slug: string, city: string, date: string) {
    const movie = await this.prisma.client.movie.findUnique({
      where: { slug, isActive: true },
    });

    if (!movie) {
      throw new NotFoundException(`Movie with slug '${slug}' not found`);
    }

    const shows = await this.prisma.client.show.findMany({
      where: {
        movieId: movie.id,
        isActive: true,
        date,
        screen: {
          theater: {
            city,
          },
        },
        startTime: {
          gte: new Date(),
        },
      },
      include: {
        screen: {
          include: {
            theater: true,
          },
        },
        _count: {
          select: {
            bookings: true,
          },
        },
      },
      orderBy: [
        {
          screen: {
            theater: {
              name: 'asc',
            },
          },
        },
        {
          startTime: 'asc',
        },
      ],
    });

    // Group shows by theater
    const groupedByTheater = shows.reduce((acc, show) => {
      const theaterId = show.screen.theater.id;
      if (!acc[theaterId]) {
        acc[theaterId] = {
          theater: show.screen.theater,
          shows: [],
        };
      }
      acc[theaterId].shows.push({
        id: show.id,
        startTime: show.startTime,
        endTime: show.endTime,
        pricing: show.pricing,
        screenName: show.screen.name,
        availableSeats:
          show.screen.totalSeats -
          (show._count?.bookings || 0) * 5, // Approximate
      });
      return acc;
    }, {});

    return {
      movie,
      theaters: Object.values(groupedByTheater),
    };
  }
}


