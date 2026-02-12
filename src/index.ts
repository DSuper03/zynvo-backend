import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root with explicit path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import express from 'express';

// Log startup info
console.log('🚀 Starting Zynvo Backend...');
console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔌 PORT: ${process.env.PORT || 8000}`);

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET'];
const conditionalEnvVars = process.env.NODE_ENV === 'production' 
  ? ['DIRECT_DATABASE_URL', 'REDIS_URL']
  : [];

const missingEnvVars = [
  ...requiredEnvVars.filter(v => !process.env[v]),
  ...conditionalEnvVars.filter(v => !process.env[v])
];

if (missingEnvVars.length > 0) {
  console.warn(`⚠️  Missing environment variables: ${missingEnvVars.join(', ')}`);
  if (process.env.NODE_ENV === 'production') {
    console.error(`❌ FATAL: Required env vars missing in production. Please set them in your Render environment variables.`);
    console.error(`Missing: ${missingEnvVars.join(', ')}`);
    process.exit(1);
  }
}

import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { userRouter } from './routes/userRouter';
import { postRouter } from './routes/postRouter';
import { limiter } from './utils/rate-limiter';
import { contactRouter } from './routes/contactRouter';
import { EventRouter } from './routes/eventRouter';
import { clubRouter } from './routes/clubRouter';
import openapiSpec from '../openapispecfile.json';
import { adminControlRouter } from './routes/adminRouter';
// ort atomicdocs from 'atomicdocs';
import { createHonoExpressMiddleware } from './hono/expressAdapter';
import { honoApp } from './hono/app';
import { createApolloServer, createGraphQLMiddleware } from './graphql/apollo-server';
import { getRequestListener } from '@hono/node-server';

const app = express()
const PORT = Number(process.env.PORT) || 8000;

console.log('⚙️  Setting up middleware and routes...');

try {
  // Create Apollo Server

const swaggerSpecPath = path.join(__dirname, '..', 'openapispecfile.json');

app.set('trust proxy', 1);

app.use(express.json());

const FE_URL = process.env.FE_URL;

const FRONTEND_URL = [ FE_URL,  'http://localhost:3000', 'https://zynvo.social', 'https://zynvo-main.vercel.app'].filter(Boolean) as string[];
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}));
app.options('*', cors({
  origin: FRONTEND_URL
}));

const honoMiddleware = createHonoExpressMiddleware(honoApp);

if (process.env.NODE_ENV !== 'production') {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'Zynvo API Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
  }));
}

const apolloServer = createApolloServer();
let apolloStartPromise: Promise<void> | null = null;
let apolloMiddleware: ReturnType<typeof createGraphQLMiddleware> | null = null;

const getApolloMiddleware = async () => {
  if (apolloMiddleware) {
    return apolloMiddleware;
  }

  if (!apolloStartPromise) {
    apolloStartPromise = apolloServer.start();
  }

  await apolloStartPromise;
  apolloMiddleware = createGraphQLMiddleware(apolloServer);
  return apolloMiddleware;
};

app.use('/graphql', async (req, res, next) => {
  try {
    const middleware = await getApolloMiddleware();
    return middleware(req, res, next);
  } catch (error) {
    return next(error);
  }
});

//-----------------V1 routes------------------------

app.use('/api/v1/user', limiter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/hono/v1', honoMiddleware);
app.use('/api/v1/events', EventRouter);
app.use('/api/v1/clubs', clubRouter);
app.use('/api/v1/contact', contactRouter);

//------------------- V2 routes --------------------

app.use('/api/v2/admin', adminControlRouter)
app.use('/api/v2/user/auth', userRouter);

//------------------- Hono (mounted at /hono) --------------------
// Routes: /hono/health, /hono/api/v1/events
const honoHandler = getRequestListener(honoApp.fetch);
app.use('/hono', (req, res, next) => {
  // Hono's listener uses req.url; Express gives mounted path in req.path
  const query = req.url?.includes('?') ? '?' + req.url.split('?')[1] : '';
  const originalUrl = req.url;
  req.url = (req.path || '/') + query;
  honoHandler(req, res)
    .catch(next)
    .finally(() => { req.url = originalUrl; });
});

// GraphQL endpoint will be added after server starts

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ msg: 'good health' });
});

// Error handler middleware
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

console.log('✅ Middleware and routes configured successfully');

} catch (error) {
  console.error('❌ Failed to configure middleware/routes:', error);
  process.exit(1);
}

const server = app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📚 Docs available at http://localhost:${PORT}/docs`);
  console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  console.log(`✨ Hono app available at http://localhost:${PORT}/hono`);
});

// Handle connection errors
server.on('error', (err: any) => {
  console.error('Server error:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
