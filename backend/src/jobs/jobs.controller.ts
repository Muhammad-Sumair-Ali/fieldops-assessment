import { Controller, Post, Get, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';   
import { RolesGuard } from '../common/guards/roles/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

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

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(id, updateJobDto);
  }

  @Patch(':id/status')
  @Roles('TECHNICIAN')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Req() req: any) {
    return this.jobsService.updateStatus(id, status, req.user.id);
  }

  @Get('stats')
  @Roles('ADMIN')
  async getStats() {
    return this.jobsService.getStats();
  }
}