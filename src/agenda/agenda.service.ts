import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { AgendaEntry } from './agenda-entry.entity';
import { User } from '../users/user.entity';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(AgendaEntry)
    private agendaRepository: Repository<AgendaEntry>,
  ) {}

  async create(
    data: {
      title: string;
      content?: string;
      entryDate: string;
      scheduledAt?: string;
      imageUrl?: string;
    },
    user: User,
  ): Promise<AgendaEntry> {
    const entry = this.agendaRepository.create({
      title: data.title,
      content: data.content,
      entryDate: data.entryDate,
      scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
      imageUrl: data.imageUrl,
      userId: user.id,
    });
    return this.agendaRepository.save(entry);
  }

  async findAll(user: User, date?: string): Promise<AgendaEntry[]> {
    const where: Record<string, unknown> = { userId: user.id };
    if (date) where.entryDate = date;
    return this.agendaRepository.find({
      where,
      order: { scheduledAt: 'ASC', createdAt: 'ASC' },
    });
  }

  async findDue(user: User): Promise<AgendaEntry[]> {
    return this.agendaRepository.find({
      where: {
        userId: user.id,
        notified: false,
        scheduledAt: LessThanOrEqual(new Date()),
      },
      order: { scheduledAt: 'ASC' },
    });
  }

  async findOne(id: number, user: User): Promise<AgendaEntry> {
    const entry = await this.agendaRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!entry) throw new NotFoundException('Agenda entry not found');
    return entry;
  }

  async update(
    id: number,
    data: UpdateAgendaDto & { imageUrl?: string },
    user: User,
  ): Promise<AgendaEntry> {
    const entry = await this.findOne(id, user);
    if (data.title !== undefined) entry.title = data.title;
    if (data.content !== undefined) entry.content = data.content;
    if (data.entryDate !== undefined) entry.entryDate = data.entryDate;
    if (data.scheduledAt !== undefined) {
      entry.scheduledAt = data.scheduledAt ? new Date(data.scheduledAt) : null;
    }
    if (data.imageUrl !== undefined) {
      if (entry.imageUrl && data.imageUrl !== entry.imageUrl) {
        await this.deleteImageFile(entry.imageUrl);
      }
      entry.imageUrl = data.imageUrl;
    }
    if (data.notified !== undefined) entry.notified = data.notified;
    return this.agendaRepository.save(entry);
  }

  async markNotified(id: number, user: User): Promise<AgendaEntry> {
    return this.update(id, { notified: true }, user);
  }

  async remove(id: number, user: User): Promise<void> {
    const entry = await this.findOne(id, user);
    if (entry.imageUrl) await this.deleteImageFile(entry.imageUrl);
    await this.agendaRepository.remove(entry);
  }

  private async deleteImageFile(imageUrl: string): Promise<void> {
    const filename = imageUrl.split('/').pop();
    if (!filename) return;
    try {
      await unlink(join(process.cwd(), 'uploads', 'agenda', filename));
    } catch {
      // file may already be gone
    }
  }
}
