import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reminder } from './reminder.entity';
import { User } from '../users/user.entity';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
  ) {}

  async create(dto: CreateReminderDto, user: User): Promise<Reminder> {
    const reminder = this.reminderRepository.create({
      title: dto.title,
      description: dto.description,
      remindAt: new Date(dto.remindAt),
      userId: user.id,
    });
    return this.reminderRepository.save(reminder);
  }

  async findAll(user: User): Promise<Reminder[]> {
    return this.reminderRepository.find({
      where: { userId: user.id },
      order: { remindAt: 'ASC' },
    });
  }

  async findDue(user: User): Promise<Reminder[]> {
    return this.reminderRepository.find({
      where: {
        userId: user.id,
        completed: false,
        notified: false,
        remindAt: LessThanOrEqual(new Date()),
      },
      order: { remindAt: 'ASC' },
    });
  }

  async findOne(id: number, user: User): Promise<Reminder> {
    const reminder = await this.reminderRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!reminder) throw new NotFoundException('Reminder not found');
    return reminder;
  }

  async update(id: number, dto: UpdateReminderDto, user: User): Promise<Reminder> {
    const reminder = await this.findOne(id, user);
    if (dto.title !== undefined) reminder.title = dto.title;
    if (dto.description !== undefined) reminder.description = dto.description;
    if (dto.remindAt !== undefined) reminder.remindAt = new Date(dto.remindAt);
    if (dto.completed !== undefined) reminder.completed = dto.completed;
    if (dto.notified !== undefined) reminder.notified = dto.notified;
    return this.reminderRepository.save(reminder);
  }

  async markNotified(id: number, user: User): Promise<Reminder> {
    return this.update(id, { notified: true }, user);
  }

  async remove(id: number, user: User): Promise<void> {
    const reminder = await this.findOne(id, user);
    await this.reminderRepository.remove(reminder);
  }
}
