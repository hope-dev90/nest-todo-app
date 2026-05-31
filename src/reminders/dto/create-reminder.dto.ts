import { IsString, IsOptional, MinLength, IsDateString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  remindAt: string;
}
