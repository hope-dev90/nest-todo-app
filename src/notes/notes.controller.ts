import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Note } from '../users/note.entity';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @CurrentUser() user: User): Promise<Note> {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User): Promise<Note[]> {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<Note> {
    return this.notesService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateNoteDto: UpdateNoteDto, 
    @CurrentUser() user: User
  ): Promise<Note> {
    return this.notesService.update(+id, updateNoteDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.notesService.remove(+id, user);
  }
}
