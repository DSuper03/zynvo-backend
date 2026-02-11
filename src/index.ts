import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

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
import path from 'path';

const app = express()
const PORT = Number(process.env.PORT) || 8000;

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

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
    console.log(`📚 Docs available at http://localhost:${PORT}/docs`);
    console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
    console.log(`✨ Hono app available at http://localhost:${PORT}/hono (e.g. /hono/health, /hono/api/v1/events)`);
  
  // Start Apollo Server
})

export default app;
