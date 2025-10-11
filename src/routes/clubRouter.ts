import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  getAllClubs,
  getClubByQuery,
  getClubsByCollege,
  getClubById,
  createClub
} from '../controller/club.controller';

const router = Router();

router.get('/getAll', AuthMiddleware, getAllClubs);
router.get('/getClub', AuthMiddleware, getClubByQuery);
router.get('/getClubs/:college', getClubsByCollege);
router.get('/:id', AuthMiddleware, getClubById);
router.post('/club', AuthMiddleware, createClub);

export const clubRouter = router;
