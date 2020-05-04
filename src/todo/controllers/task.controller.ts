import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { CreateTask } from '~todo/dtos/create-task.dto';
import { EditTask } from '~todo/dtos/edit-task.dto';
import { TaskService } from '~todo/services/task.service';

const idPath =
  ':id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})';

@Controller('task')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  createOne(@Body() newTask: CreateTask) {
    return this.service.createOne(newTask);
  }

  @Get(idPath)
  getOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.getOne(id);
  }

  @Get()
  findAll(@Query('page') page?: string, @Query('size') size?: string) {
    return this.service.findAll(parseInt(page, 10), parseInt(size, 10));
  }

  @Put(idPath)
  updateOne(@Param('id', ParseUUIDPipe) id: string, @Body() updates: EditTask) {
    return this.service.updateOne(id, updates);
  }

  @Patch(idPath)
  async patchOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updates: EditTask,
  ) {
    const task = await this.service.updateOne(id, updates);

    return Object.keys(updates).reduce(
      // eslint-disable-next-line security/detect-object-injection
      (object, property) => ({ ...object, [property]: task[property] }),
      {},
    );
  }

  @Delete(idPath)
  removeOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.removeOne(id);
  }
}
