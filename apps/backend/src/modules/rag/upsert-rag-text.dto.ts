import { IsObject, IsOptional, IsString } from 'class-validator';

export class UpsertRagTextDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  text!: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
