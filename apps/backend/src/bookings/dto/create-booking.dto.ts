import {
  IsString,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  ArrayMinSize,
} from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  showId: string;

  @IsArray()
  @ArrayMinSize(1)
  seatIds: string[];

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  userPhone: string;

  @IsString()
  @IsNotEmpty()
  sessionId: string;
}


