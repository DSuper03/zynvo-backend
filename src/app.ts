import express, { Request, Response } from 'express';
import cors from 'cors';
import { limiter } from './utils/rate-limiter';
import { clubRouter } from './routes/clubRouter';
import { userRouter } from './routes/userRouter';
import { postRouter } from './routes/postRouter';
import { contactRouter } from './routes/contactRouter';
import { EventRouter } from './routes/eventRouter';

const app = express();

// trust proxy if deploying behind proxy
app.set('trust proxy', 1);
app.use(express.json());
app.use(cors());
app.use('/api/v1/user', limiter, userRouter);
app.use('/api/v1/clubs', clubRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/events', EventRouter);
app.use('/api/v1/contact', contactRouter);

app.get('/health', (_req: any, res: any) => {
  res.status(200).json({ msg: 'good health' });
});


export default app;