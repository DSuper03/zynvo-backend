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


const app = express()
const PORT = 8000;
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
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, {
    customSiteTitle: 'Zynvo API Documentation',
    customCss: '.swagger-ui .topbar { display: none }'
  }));
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

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ msg: 'good health' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);


});
