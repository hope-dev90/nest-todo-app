import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Todo } from '../users/note.entity'; // Now using Todo instead of Note

@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
