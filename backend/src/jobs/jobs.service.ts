import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private prisma: PrismaService) { }

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

    if (job.technicianId !== technicianId) {
      throw new ForbiddenException('You can only update your assigned jobs');
    }

    const oldStatus = job.status;
    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data: { status: status as JobStatus },
      include: { client: true, technician: true },
    });

    if (oldStatus !== status) {
      await this.logActivity(jobId, 'Status Changed', technicianId, oldStatus, status);
    }

    return updatedJob;
  }

  async update(jobId: string, updateData: any, adminId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) throw new NotFoundException('Job not found');

    const oldStatus = job.status;
    const data: any = { ...updateData };
    if (updateData.scheduledDate !== undefined) {
      data.scheduledDate = updateData.scheduledDate ? new Date(updateData.scheduledDate) : null;
    }
    if (updateData.technicianId === '') {
      data.technicianId = null;
    }

    const updatedJob = await this.prisma.job.update({
      where: { id: jobId },
      data,
      include: { client: true, technician: true },
    });

    if (updateData.status && oldStatus !== updateData.status) {
      await this.logActivity(jobId, 'Status Changed', adminId, oldStatus, updateData.status);
    } else if (updateData.technicianId !== undefined && job.technicianId !== updatedJob.technicianId) {
      await this.logActivity(jobId, 'Technician Reassigned', adminId, job.technicianId || 'Unassigned', updatedJob.technicianId || 'Unassigned');
    }

    return updatedJob;
  }

  async logActivity(jobId: string, action: string, changedBy: string, oldValue?: string, newValue?: string) {
    return this.prisma.jobLog.create({
      data: {
        jobId,
        action,
        changedBy,
        oldValue: oldValue?.toString(),
        newValue: newValue?.toString(),
      },
    });
  }

  async getJobLogs(jobId: string) {
    const logs = await this.prisma.jobLog.findMany({
      where: { jobId },
      orderBy: { createdAt: 'desc' },
    });

    // Fetch user names for the 'changedBy' field
    const userIds = [...new Set(logs.map(log => log.changedBy))];
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true },
    });

    const userMap = new Map(users.map(u => [u.id, u.name || 'Unknown User']));

    return logs.map(log => ({
      ...log,
      userName: userMap.get(log.changedBy),
    }));
  }

  async getStats() {
    const [total, draft, scheduled, inProgress, completed, cancelled] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.count({ where: { status: 'DRAFT' } }),
      this.prisma.job.count({ where: { status: 'SCHEDULED' } }),
      this.prisma.job.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.job.count({ where: { status: 'COMPLETED' } }),
      this.prisma.job.count({ where: { status: 'CANCELLED' } }),
    ]);

    return {
      totalJobs: total,
      draft,
      scheduled,
      inProgress,
      completed,
      cancelled,
    };
  }
}
