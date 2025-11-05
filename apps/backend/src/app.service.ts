import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🎬 Welcome to MovieTix API - A BookMyShow Clone';
  }
}
