import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTask } from '~todo/dtos/create-task.dto';
import { EditTask } from '~todo/dtos/edit-task.dto';
import { Task } from '~todo/entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  createOne(newTask: CreateTask) {
    const task = this.repository.create(newTask);

    return this.repository.save(task);
  }

  async getOne(id: string) {
    const task = await this.repository.findOne(id);

    if (!task) throw new NotFoundException();

    return task;
  }

  findAll(page: number, limit: number) {
    if (!Number.isFinite(page) || page < 1) page = 1;

    if (!Number.isFinite(limit) || limit < 1) limit = 10;

    return this.repository.find({ skip: limit * (page - 1), take: limit });
  }

  async updateOne(id: string, updates: EditTask) {
    let task = await this.getOne(id);
    task = this.repository.merge(task, updates);

    return this.repository.save(task);
  }

  async removeOne(id: string) {
    const task = await this.getOne(id);

    return this.repository.remove(task);
  }
}
