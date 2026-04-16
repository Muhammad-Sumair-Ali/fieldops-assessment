import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  enableShutdownHooks(app: INestApplication): void {
    this.$on('beforeExit' as never, () => {
      void app.close();
    });
  }
}
