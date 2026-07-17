import { PrismaClient } from '@prisma/client';

// Singleton pattern prevents exhausting SQLite connections during
// hot-reload in development (tsx watch re-executes this module).
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
