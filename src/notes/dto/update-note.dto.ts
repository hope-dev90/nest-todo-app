import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Title must not be empty' })
  title?: string;

  @IsString()
  @IsOptional()
  content?: string;
}
