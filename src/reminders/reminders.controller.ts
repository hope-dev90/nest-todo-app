import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
export class RemindersController {
  constructor(private readonly remindersService: RemindersService) {}

  @Post()
  create(@Body() dto: CreateReminderDto, @CurrentUser() user: User) {
    return this.remindersService.create(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.remindersService.findAll(user);
  }

  @Get('due')
  findDue(@CurrentUser() user: User) {
    return this.remindersService.findDue(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.remindersService.findOne(+id, user);
  }

  @Patch(':id/notified')
  markNotified(@Param('id') id: string, @CurrentUser() user: User) {
    return this.remindersService.markNotified(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReminderDto,
    @CurrentUser() user: User,
  ) {
    return this.remindersService.update(+id, dto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.remindersService.remove(+id, user);
  }
}
