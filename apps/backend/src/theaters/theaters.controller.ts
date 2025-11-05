import { Controller, Get, Query } from '@nestjs/common';
import { TheatersService } from './theaters.service';

@Controller('theaters')
export class TheatersController {
  constructor(private readonly theatersService: TheatersService) {}

  @Get()
  findAll(@Query('city') city?: string) {
    return this.theatersService.findAll(city);
  }

  @Get('cities')
  getCities() {
    return this.theatersService.getCities();
  }
}


