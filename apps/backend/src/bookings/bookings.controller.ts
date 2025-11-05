import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get(':bookingCode')
  findOne(@Param('bookingCode') bookingCode: string) {
    return this.bookingsService.findByCode(bookingCode);
  }

  @Post(':bookingCode/confirm')
  confirm(@Param('bookingCode') bookingCode: string) {
    return this.bookingsService.confirmBooking(bookingCode);
  }

  @Post(':bookingCode/cancel')
  cancel(@Param('bookingCode') bookingCode: string) {
    return this.bookingsService.cancelBooking(bookingCode);
  }
}


