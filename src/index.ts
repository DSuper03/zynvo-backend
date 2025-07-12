import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/userRouter';
import { postRouter } from './routes/postRouter';
import { limiter } from './utils/rate-limiter';
import { contactRouter } from './routes/contactRouter';
import { EventRouter } from './routes/eventRouter';
import { clubRouter } from './routes/clubRouter';

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());
app.use('/api/v1/user', limiter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/post', postRouter);
app.use('/api/v1/events', EventRouter);
app.use('/api/v1/clubs', clubRouter);
app.use('/api/v1/contact', contactRouter);

app.get('/health', (req: any, res: any) => {
  res.status(200).json({ msg: 'good health' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
