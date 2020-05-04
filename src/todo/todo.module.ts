import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TaskController } from '~todo/controllers/task.controller';
import { Task } from '~todo/entities/task.entity';
import { TaskService } from '~todo/services/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TodoModule {}
