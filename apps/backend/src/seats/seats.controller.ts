import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { LockSeatsDto } from './dto/lock-seats.dto';
import { ReleaseSeatsDto } from './dto/release-seats.dto';

@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @Get('availability/:showId')
  getAvailability(@Param('showId') showId: string) {
    return this.seatsService.getAvailability(showId);
  }

  @Post('lock')
  lockSeats(@Body() lockSeatsDto: LockSeatsDto) {
    return this.seatsService.lockSeats(lockSeatsDto);
  }

  @Post('release')
  releaseSeats(@Body() releaseSeatsDto: ReleaseSeatsDto) {
    return this.seatsService.releaseSeats(releaseSeatsDto);
  }
}


