import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  title?: string;

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
  @IsOptional()
  technicianId?: string;
}
