import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Todo } from '../users/note.entity';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@Body() createNoteDto: CreateNoteDto, @CurrentUser() user: User): Promise<Todo> {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query('search') search?: string): Promise<Todo[]> {
    console.log('NotesController.findAll called with user id:', user.id, 'search:', search);
    return this.notesService.findAll(user, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User): Promise<Todo> {
    return this.notesService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateNoteDto: UpdateNoteDto, 
    @CurrentUser() user: User
  ): Promise<Todo> {
    return this.notesService.update(+id, updateNoteDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.notesService.remove(+id, user);
  }
}
