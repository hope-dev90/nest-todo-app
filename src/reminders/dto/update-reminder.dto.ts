import { IsString, IsOptional, MinLength, IsDateString, IsBoolean } from 'class-validator';

export class UpdateReminderDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  remindAt?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsBoolean()
  @IsOptional()
  notified?: boolean;
}
