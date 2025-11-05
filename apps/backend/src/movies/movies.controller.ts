import { Controller, Get, Param, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  findAll(
    @Query('city') city?: string,
    @Query('genre') genre?: string,
    @Query('language') language?: string,
  ) {
    return this.moviesService.findAll({ city, genre, language });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.moviesService.findBySlug(slug);
  }

  @Get(':slug/shows')
  getShows(
    @Param('slug') slug: string,
    @Query('city') city: string,
    @Query('date') date: string,
  ) {
    return this.moviesService.getShowsForMovie(slug, city, date);
  }
}


