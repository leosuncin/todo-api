import { build, fake } from '@jackfranklin/test-data-bot';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '~app/app.module';
import { TaskService } from '~todo/services/task.service';

const createTaskBuilder = build('CreateTask', {
  fields: {
    text: fake(f => f.lorem.sentence()),
  },
});

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let service: TaskService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    service = app.get(TaskService);
    app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it.each([
    [createTaskBuilder(), HttpStatus.CREATED],
    [{}, HttpStatus.BAD_REQUEST],
  ])(
    '/task (POST) with body %p and expect %d status',
    async (body, statusCode) => {
      await request(app.getHttpServer())
        .post('/task')
        .send(body)
        .expect(statusCode)
        .expect('Content-Type', /json/)
        .expect(response => expect(response.body).toBeDefined());
    },
  );

  it('/task (GET)', async () => {
    await request(app.getHttpServer())
      .get('/task')
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(resp => expect(resp.body).toEqual(expect.any(Array)));
  });

  it('/task/:id (GET)', async () => {
    const task = await service.createOne(createTaskBuilder() as any);

    await request(app.getHttpServer())
      .get(`/task/${task.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .expect(response =>
        expect(response.body).toMatchObject({
          id: expect.stringMatching(
            /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
          ),
          text: task.text,
          done: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
  });

  it.each([
    [createTaskBuilder({ map: t => ({ ...t, done: true }) }), HttpStatus.OK],
    [{ done: true }, HttpStatus.OK],
  ])(
    '/task/:id (PUT) with body %p and expect %d status',
    async (updates, statusCode) => {
      const task = await service.createOne(createTaskBuilder() as any);

      await request(app.getHttpServer())
        .put(`/task/${task.id}`)
        .send(updates)
        .expect(statusCode)
        .expect('Content-Type', /json/)
        .expect(response =>
          expect(response.body).toMatchObject({
            id: expect.stringMatching(
              /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
            ),
            text: expect.any(String),
            done: true,
            createdAt: task.createdAt.toISOString(),
            updatedAt: expect.any(String),
          }),
        );
    },
  );

  it.each([
    [createTaskBuilder(), HttpStatus.OK],
    [{ done: true }, HttpStatus.OK],
  ])(
    '/task/:id (PATH) with body %p and expect %d status',
    async (updates, statusCode) => {
      const task = await service.createOne(createTaskBuilder() as any);

      await request(app.getHttpServer())
        .patch(`/task/${task.id}`)
        .send(updates)
        .expect(statusCode)
        .expect('Content-Type', /json/)
        .expect(response => expect(response.body).toMatchObject(updates));
    },
  );

  it('/task/:id (DELETE)', async () => {
    const task = await service.createOne(createTaskBuilder() as any);

    await request(app.getHttpServer())
      .delete(`/task/${task.id}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/);

    await expect(service.getOne(task.id)).rejects.toThrow();
  });
});
