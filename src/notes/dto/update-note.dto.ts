import { IsString, IsOptional, MinLength, IsBoolean } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Title must not be empty' })
  title?: string;

  @IsString()
  @IsOptional()
  content?: string; // Optional, for backward compatibility with frontend

  @IsString()
  @IsOptional()
  description?: string; // Optional, for direct use with DB column

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;
}
