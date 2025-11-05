import { IsString, IsNotEmpty } from 'class-validator';

export class ReleaseSeatsDto {
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}


