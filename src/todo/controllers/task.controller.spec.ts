import { bool, build, fake, perBuild } from '@jackfranklin/test-data-bot';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { FindManyOptions } from 'typeorm';

import { TaskController } from '~todo/controllers/task.controller';
import { CreateTask } from '~todo/dtos/create-task.dto';
import { EditTask } from '~todo/dtos/edit-task.dto';
import { Task } from '~todo/entities/task.entity';
import { TaskService } from '~todo/services/task.service';

class MockRepository {
  private readonly factory = build<Task>('Task', {
    fields: {
      id: fake(f => f.random.uuid()),
      text: fake(f => f.lorem.sentence()),
      done: bool(),
      createdAt: perBuild(() => new Date()),
      updatedAt: perBuild(() => new Date()),
    },
    postBuild: t => ({ ...t, done: false }),
  });

  create(dto) {
    return dto;
  }

  save(dto) {
    return Promise.resolve(this.factory({ map: t => ({ ...t, ...dto }) }));
  }

  findOne(id) {
    return Promise.resolve(
      !Boolean(id) ? null : this.factory({ overrides: { id } }),
    );
  }

  find(options: FindManyOptions<Task>) {
    return Promise.resolve(Array.from({ length: options.take }, this.factory));
  }

  merge(entity, dto) {
    return Object.assign(entity, dto);
  }

  remove(id) {
    return Promise.resolve(this.factory({ overrides: { id } }));
  }
}

describe('Task Controller', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useClass: MockRepository,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new task', () => {
    const data: CreateTask = {
      text: 'todo',
    };

    return expect(controller.createOne(data)).resolves.toHaveProperty(
      'done',
      false,
    );
  });

  it('should get one task', () =>
    expect(
      controller.getOne('a23901a8-8efb-43e8-bcc4-07222cffe5df'),
    ).resolves.toBeDefined());

  it('should fail if task not exists', () =>
    expect(controller.getOne('')).rejects.toThrow(NotFoundException));

  it.each([
    ['a', 'b'],
    ['0', '0'],
    ['1', '0'],
    ['-1', '-1'],
    ['1', '10'],
    [undefined, undefined],
    [null, null],
  ])('should list the tasks', async (page, limit) => {
    const tasks = await controller.findAll(page, limit);

    expect(tasks).toEqual(expect.any(Array));
    expect(tasks).toHaveLength(10);
  });

  it('should edit a task', () => {
    const id = 'a23901a8-8efb-43e8-bcc4-07222cffe5df';
    const data: EditTask = {
      text: 'todo',
      done: true,
    };

    return expect(controller.updateOne(id, data)).resolves.toMatchObject({
      id,
      text: data.text,
      done: data.done,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it('should patch only some properties of a task', async () => {
    const id = 'a23901a8-8efb-43e8-bcc4-07222cffe5df';

    await expect(
      controller.patchOne(id, { text: 'todo' }),
    ).resolves.not.toHaveProperty('done');
    await expect(
      controller.patchOne(id, { done: true }),
    ).resolves.not.toHaveProperty('text');
  });

  it('should remove one task', () =>
    expect(
      controller.removeOne('a23901a8-8efb-43e8-bcc4-07222cffe5df'),
    ).resolves.toBeDefined());
});
