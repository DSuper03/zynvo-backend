import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    // process.env (not env()) so `prisma generate` works in CI builds where no
    // database URL is set; migrate/seed still need DIRECT_DATABASE_URL.
    url: process.env.DIRECT_DATABASE_URL ?? '',
  },
})