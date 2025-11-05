import { IsString, IsArray, IsNotEmpty } from 'class-validator';

export class LockSeatsDto {
  @IsString()
  @IsNotEmpty()
  showId: string;

  @IsArray()
  @IsNotEmpty()
  seatIds: string[];

  @IsString()
  @IsNotEmpty()
  sessionId: string;
}


