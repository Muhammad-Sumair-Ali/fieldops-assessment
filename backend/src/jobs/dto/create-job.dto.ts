import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['DRAFT', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsUUID()
  @IsNotEmpty()
  clientId: string;

  @IsUUID()
  @IsOptional()
  technicianId?: string;
}