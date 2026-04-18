import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fieldops.com' },
    update: {},
    create: {
      email: 'admin@fieldops.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create Technician
  const technician = await prisma.user.upsert({
    where: { email: 'tech@fieldops.com' },
    update: {},
    create: {
      email: 'tech@fieldops.com',
      password: hashedPassword,
      name: 'John Technician',
      role: 'TECHNICIAN',
    },
  });

  // Create Client
  const client = await prisma.user.upsert({
    where: { email: 'client@fieldops.com' },
    update: {},
    create: {
      email: 'client@fieldops.com',
      password: hashedPassword,
      name: 'ABC Company',
      role: 'CLIENT',
    },
  });

  // Create Jobs
  const job1 = await prisma.job.upsert({
    where: { id: 'seed-job-1' },
    update: {},
    create: {
      id: 'seed-job-1',
      title: 'HVAC Inspection',
      description: 'Annual HVAC system inspection at client site.',
      status: 'SCHEDULED',
      clientId: client.id,
      technicianId: technician.id,
      scheduledDate: new Date('2025-05-01T10:00:00Z'),
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: 'seed-job-2' },
    update: {},
    create: {
      id: 'seed-job-2',
      title: 'Electrical Repair',
      description: 'Fix faulty wiring in building B.',
      status: 'IN_PROGRESS',
      clientId: client.id,
      technicianId: technician.id,
      scheduledDate: new Date('2025-04-20T09:00:00Z'),
    },
  });

  const job3 = await prisma.job.upsert({
    where: { id: 'seed-job-3' },
    update: {},
    create: {
      id: 'seed-job-3',
      title: 'Plumbing Installation',
      description: 'Install new pipes in server room.',
      status: 'DRAFT',
      clientId: client.id,
      technicianId: null,
      scheduledDate: null,
    },
  });

  const job4 = await prisma.job.upsert({
    where: { id: 'seed-job-4' },
    update: {},
    create: {
      id: 'seed-job-4',
      title: 'Fire Alarm Testing',
      description: 'Routine fire alarm system test and certification.',
      status: 'COMPLETED',
      clientId: client.id,
      technicianId: technician.id,
      scheduledDate: new Date('2025-04-10T08:00:00Z'),
    },
  });

  // Seed Job Logs (Activity Timeline)
  await prisma.jobLog.createMany({
    skipDuplicates: true,
    data: [
      {
        jobId: job1.id,
        changedBy: admin.id,
        action: 'Job Created',
        oldValue: null,
        newValue: 'SCHEDULED',
      },
      {
        jobId: job1.id,
        changedBy: admin.id,
        action: 'Technician Assigned',
        oldValue: null,
        newValue: technician.name,
      },
      {
        jobId: job2.id,
        changedBy: admin.id,
        action: 'Job Created',
        oldValue: null,
        newValue: 'SCHEDULED',
      },
      {
        jobId: job2.id,
        changedBy: technician.id,
        action: 'Status Changed',
        oldValue: 'SCHEDULED',
        newValue: 'IN_PROGRESS',
      },
      {
        jobId: job4.id,
        changedBy: admin.id,
        action: 'Job Created',
        oldValue: null,
        newValue: 'SCHEDULED',
      },
      {
        jobId: job4.id,
        changedBy: technician.id,
        action: 'Status Changed',
        oldValue: 'SCHEDULED',
        newValue: 'IN_PROGRESS',
      },
      {
        jobId: job4.id,
        changedBy: technician.id,
        action: 'Status Changed',
        oldValue: 'IN_PROGRESS',
        newValue: 'COMPLETED',
      },
    ],
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());