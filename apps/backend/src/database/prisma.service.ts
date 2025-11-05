import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { prisma } from '@movietix/database';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prisma.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
    console.log('❌ Database disconnected');
  }

  get client() {
    return prisma;
  }
}


