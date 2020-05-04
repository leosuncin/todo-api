import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1588549746838 implements MigrationInterface {
  name = 'CreateTaskTable1588549746838';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "text" character varying NOT NULL,
  "done" boolean NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id")
)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
