import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Todo } from '../users/note.entity';
import { Request } from 'express';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  create(
    @Req() req: Request,
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Todo> {
    console.log('NotesController.create - req.body:', req.body);
    console.log('NotesController.create - file:', file);
    const createNoteDto: CreateNoteDto = {
      title: req.body.title,
      content: req.body.content,
      color: req.body.color,
      isPinned: req.body.isPinned === 'true',
    };
    return this.notesService.create(createNoteDto, user, file);
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
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
      }
    })
  }))
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Todo> {
    console.log('NotesController.update - req.body:', req.body);
    console.log('NotesController.update - file:', file);
    const updateNoteDto: UpdateNoteDto = {
      title: req.body.title,
      content: req.body.content,
      color: req.body.color,
      isPinned: req.body.isPinned ? req.body.isPinned === 'true' : undefined,
    };
    return this.notesService.update(+id, updateNoteDto, user, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User): Promise<void> {
    return this.notesService.remove(+id, user);
  }
}
