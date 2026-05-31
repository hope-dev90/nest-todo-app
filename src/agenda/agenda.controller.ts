import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AgendaService } from './agenda.service';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

const imageStorage = diskStorage({
  destination: join(process.cwd(), 'uploads', 'agenda'),
  filename: (_req, file, cb) => {
    cb(null, `${uuidv4()}${extname(file.originalname)}`);
  },
});

const imageFilter = (
  _req: unknown,
  file: { mimetype: string },
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
    cb(new Error('Only image files are allowed'), false);
    return;
  }
  cb(null, true);
};

@Controller('agenda')
@UseGuards(JwtAuthGuard)
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: imageStorage,
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  create(
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
    @UploadedFile() file?: { filename: string },
  ) {
    if (!body.title?.trim()) throw new BadRequestException('Title is required');
    if (!body.entryDate) throw new BadRequestException('Entry date is required');

    const imageUrl = file ? `/api/uploads/agenda/${file.filename}` : undefined;
    return this.agendaService.create(
      {
        title: body.title.trim(),
        content: body.content?.trim() || undefined,
        entryDate: body.entryDate,
        scheduledAt: body.scheduledAt || undefined,
        imageUrl,
      },
      user,
    );
  }

  @Get()
  findAll(@CurrentUser() user: User, @Query('date') date?: string) {
    return this.agendaService.findAll(user, date);
  }

  @Get('due')
  findDue(@CurrentUser() user: User) {
    return this.agendaService.findDue(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.agendaService.findOne(+id, user);
  }

  @Patch(':id/notified')
  markNotified(@Param('id') id: string, @CurrentUser() user: User) {
    return this.agendaService.markNotified(+id, user);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: imageStorage,
      fileFilter: imageFilter,
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() body: Record<string, string>,
    @CurrentUser() user: User,
    @UploadedFile() file?: { filename: string },
  ) {
    const dto: UpdateAgendaDto & { imageUrl?: string } = {};
    if (body.title !== undefined) dto.title = body.title.trim();
    if (body.content !== undefined) dto.content = body.content.trim();
    if (body.entryDate !== undefined) dto.entryDate = body.entryDate;
    if (body.scheduledAt !== undefined) {
      dto.scheduledAt = body.scheduledAt || undefined;
    }
    if (file) dto.imageUrl = `/api/uploads/agenda/${file.filename}`;
    return this.agendaService.update(+id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.agendaService.remove(+id, user);
  }
}
