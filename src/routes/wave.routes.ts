import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { waveUser } from '../controller/wave.controller';

const router = Router();

// POST /api/v1/users/:userId/wave
router.post('/:userId/wave', AuthMiddleware, waveUser);

export const waveRouter = router;
