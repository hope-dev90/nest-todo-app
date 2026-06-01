import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Todo } from '../users/note.entity';
import { User } from '../users/user.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async create(createNoteDto: CreateNoteDto, user: User, file?: Express.Multer.File): Promise<any> {
    console.log('NotesService.create called with:', { user, createNoteDto, file });
    const todoData: any = {
      title: createNoteDto.title,
      description: createNoteDto.content || (createNoteDto as any).description,
      userId: user.id,
      isPinned: createNoteDto.isPinned,
      color: createNoteDto.color || '#7C3AED',
      imageUrl: file ? `/uploads/${file.filename}` : null,
    };
    console.log('todoData before save:', todoData);
    const todo = this.todoRepository.create(todoData);
    const savedTodo = await this.todoRepository.save(todo) as unknown as Todo;
    console.log('NotesService.create saved:', savedTodo);
    return { ...savedTodo, content: savedTodo.description };
  }

  async findAll(user: User, search?: string): Promise<any[]> {
    console.log('NotesService.findAll called with:', { user, search });
    let todos: Todo[];
    if (search) {
      todos = await this.todoRepository.find({
        where: [
          { userId: user.id, title: ILike(`%${search}%`) },
          { userId: user.id, description: ILike(`%${search}%`) },
        ],
        order: { isPinned: 'DESC', createdAt: 'DESC' },
      });
    } else {
      todos = await this.todoRepository.find({
        where: { userId: user.id },
        order: { isPinned: 'DESC', createdAt: 'DESC' },
      });
    }
    console.log('NotesService.findAll found:', todos.length, 'todos');
    console.log('Todos with details:', todos.map(todo => ({ id: todo.id, title: todo.title, color: todo.color, imageUrl: todo.imageUrl })));
    // Explicitly set content for frontend compatibility
    return todos.map(todo => ({
      ...todo,
      content: todo.description,
    }));
  }

  async findOne(id: number, user: User): Promise<any> {
    const todo = await this.todoRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return { ...todo, content: todo.description };
  }

  async update(id: number, updateNoteDto: UpdateNoteDto, user: User, file?: Express.Multer.File): Promise<any> {
    console.log('NotesService.update called with:', { id, updateNoteDto, user, file });
    const todo = await this.todoRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!todo) throw new NotFoundException('Todo not found');
    
    const updateData: any = {};
    if (updateNoteDto.title !== undefined) updateData.title = updateNoteDto.title;
    if (updateNoteDto.content !== undefined) updateData.description = updateNoteDto.content;
    if (updateNoteDto.color !== undefined) updateData.color = updateNoteDto.color;
    if (updateNoteDto.isPinned !== undefined) updateData.isPinned = updateNoteDto.isPinned;
    if (file) updateData.imageUrl = `/uploads/${file.filename}`;
    
    console.log('updateData:', updateData);
    
    Object.assign(todo, updateData);
    const saved = await this.todoRepository.save(todo);
    console.log('NotesService.update saved:', saved);
    return { ...saved, content: saved.description };
  }

  async remove(id: number, user: User): Promise<void> {
    const todo = await this.findOne(id, user);
    await this.todoRepository.remove(todo);
  }
}
