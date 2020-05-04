import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateTask {
  @IsDefined()
  @IsString()
  @IsNotEmpty()
  readonly text: string;
}
