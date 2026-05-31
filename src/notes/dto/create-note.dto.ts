import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @MinLength(1, { message: 'Title must not be empty' })
  title: string;

  @IsString()
  @IsOptional()
  content?: string;
}
