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
import path from 'path';
import { adminControlRouter } from './routes/adminRouter';

import { startHonoServer } from './hono/server';

import { createApolloServer, createGraphQLMiddleware } from './graphql/apollo-server';

const app = express()
const PORT = 8000;

// Create Apollo Server
const apolloServer = createApolloServer();

const swaggerSpecPath = path.join(__dirname, '..', 'openapispecfile.json');

app.set('trust proxy', 1);

app.use(express.json());

const FE_URL = process.env.FE_URL as string

const FRONTEND_URL = [ FE_URL,  'http://localhost:3000', 'https://zynvo.social', 'https://zynvo-main.vercel.app'];
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
}));
app.options('*', cors({
  origin: FRONTEND_URL
}));

if (process.env.NODE_ENV !== 'production') {
  app.get('/docs/openapi.json', (_req, res) => {
    res.sendFile(swaggerSpecPath);
  });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: '/docs/openapi.json' },
      customSiteTitle: 'Zynvo API Documentation',
      customCss: '.swagger-ui .topbar { display: none }'
    })
  );
}

//-----------------V1 routes------------------------

app.use('/api/v1/user', limiter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/events', EventRouter);
app.use('/api/v1/clubs', clubRouter);
app.use('/api/v1/contact', contactRouter);

//------------------- V2 routes --------------------

app.use('/api/v2/admin', adminControlRouter)
app.use('/api/v2/user/auth', userRouter);

// GraphQL endpoint will be added after server starts

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ msg: 'good health' });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
    console.log(`📚 Docs available at http://localhost:${PORT}/docs`);
    console.log(`🚀 GraphQL endpoint available at http://localhost:${PORT}/graphql`);
  
  // Start Apollo Server
  await apolloServer.start();

  // Add GraphQL endpoint after server starts
  app.use('/graphql', createGraphQLMiddleware(apolloServer));

  // Register routes after server starts
 
  startHonoServer();
  

});
