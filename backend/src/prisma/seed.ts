import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  // Create Admin
  await prisma.user.upsert({
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
  await prisma.user.upsert({
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
  await prisma.user.upsert({
    where: { email: 'client@fieldops.com' },
    update: {},
    create: {
      email: 'client@fieldops.com',
      password: hashedPassword,
      name: 'ABC Company',
      role: 'CLIENT',
    },
  });

  console.log('✅ Seed data created successfully');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());