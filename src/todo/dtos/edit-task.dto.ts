import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditTask {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly text?: string;

  @IsOptional()
  @IsBoolean()
  readonly done?: boolean;
}
