import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) {}

  async create(createJobDto: CreateJobDto) {
    // Admin job create 
    const job = await this.prisma.job.create({
      data: {
        title: createJobDto.title,
        description: createJobDto.description,
        status: (createJobDto.status || 'DRAFT') as JobStatus,
        scheduledDate: createJobDto.scheduledDate ? new Date(createJobDto.scheduledDate) : null,
        clientId: createJobDto.clientId,
        technicianId: createJobDto.technicianId || null,
      },
      include: {
        client: true,
        technician: true,
      },
    });

    return job;
  }

  async findAll(user: any) {
    const { id, role } = user;

    if (role === 'ADMIN') {
      // Admin can view all jobs
      return this.prisma.job.findMany({
        include: { client: true, technician: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === 'TECHNICIAN') {
      // Technician can see only assigned jobs
      return this.prisma.job.findMany({
        where: { technicianId: id },
        include: { client: true, technician: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    if (role === 'CLIENT') {
      // Client can see only own jobs
      return this.prisma.job.findMany({
        where: { clientId: id },
        include: { client: true, technician: true },
        orderBy: { createdAt: 'desc' },
      });
    }

    return [];
  }

  async updateStatus(jobId: string, status: string, technicianId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) throw new NotFoundException('Job not found');

    // only assigned technician can update status og

    if (job.technicianId !== technicianId) {
      throw new ForbiddenException('You can only update your assigned jobs');
    }

    return this.prisma.job.update({
      where: { id: jobId },
      data: { status: status as JobStatus },
      include: { client: true, technician: true },
    });
  }
}