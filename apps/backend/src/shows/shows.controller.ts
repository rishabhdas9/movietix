import { Controller, Get, Param } from '@nestjs/common';
import { ShowsService } from './shows.service';

@Controller('shows')
export class ShowsController {
  constructor(private readonly showsService: ShowsService) {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.showsService.findOne(id);
  }
}


