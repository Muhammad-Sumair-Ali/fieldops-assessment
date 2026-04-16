import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';   // hum isko abhi bana denge
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll(@Req() req: any) {
    const user = req.user;
    return this.jobsService.findAll(user);
  }

  @Patch(':id/status')
  @Roles('TECHNICIAN')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.jobsService.updateStatus(id, status, req.user.id);
  }
}