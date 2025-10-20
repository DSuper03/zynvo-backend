import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { cache, purgeCache } from '../middleware/cachelayer';
import {
  getAllClubs,
  getClubByQuery,
  getClubsByCollege,
  getClubById,
  createClub,
  updateLink,
  addWings
} from '../controller/club.controller';

const router = Router();

router.get('/getAll', AuthMiddleware, cache({ key: 'all-clubs', ttl: 600, tags: ['clubs'] }), getAllClubs);
router.get('/getClub', AuthMiddleware, cache({ key: 'club-query', ttl: 600, tags: ['clubs'] }), getClubByQuery);
router.get('/getClubs/:college', cache({ key: 'clubs-by-college', ttl: 600, tags: ['clubs'] }), getClubsByCollege);
router.get('/:id', AuthMiddleware, cache({ key: 'club-by-id', ttl: 600, tags: ['clubs'] }), getClubById);
router.post('/club', AuthMiddleware, purgeCache(['clubs']), createClub);
router.put('updateLinks/:id', AuthMiddleware, updateLink);
router.put('addWings/:id', AuthMiddleware, addWings);

export const clubRouter = router;
