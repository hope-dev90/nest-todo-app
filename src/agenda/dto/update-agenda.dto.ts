import { IsString, IsOptional, MinLength, IsDateString, IsBoolean } from 'class-validator';

export class UpdateAgendaDto {
  @IsString()
  @MinLength(1)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsDateString()
  @IsOptional()
  entryDate?: string;

  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsBoolean()
  @IsOptional()
  notified?: boolean;
}
