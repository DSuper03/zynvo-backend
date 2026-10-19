import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  getAllClubs,
  getClubByQuery,
  getClubsByCollege,
  getClubById,
  getPublicClubs,
  createClub,
} from '../controller/club.controller';
import { getClubAllannouncements } from '../controller/club.ann.controller';

const router = Router();

// Public (no auth token) — must stay before the `/:id` route so it isn't
// matched as a club id.
router.get('/public', getPublicClubs);

router.get('/getAll', AuthMiddleware, getAllClubs);
router.get('/getClub', AuthMiddleware, getClubByQuery);
router.get('/getClubs/:college', getClubsByCollege);
router.get('/:id', AuthMiddleware, getClubById);
router.post('/club', AuthMiddleware, createClub);

router.get('/getAnn/:clubId',AuthMiddleware, getClubAllannouncements);
export const clubRouter = router;
