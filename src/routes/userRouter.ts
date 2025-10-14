import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { cache, purgeCache } from '../middleware/cachelayer';
import { 
  signup,
  login,
  resendEmail, 
  verifyEmail, 
  resetPassword 
} from '../controller/auth.controller';
import { 
  getUser, 
  joinClub, 
  isFounder, 
  updateProfile, 
  getSidebarUser, 
  searchUser, 
  getPublicUser, 
  getAllUsers 
} from '../controller/user.controller';

const router = Router();

router.post('/signup', purgeCache(['users']), signup);
router.post('/login', login);
router.post('/ResendEmail', resendEmail);
router.post('/verify', verifyEmail);
router.put('/reset-password', AuthMiddleware, purgeCache(['users']), resetPassword);

router.get('/getUser', AuthMiddleware, cache({ key: 'user', ttl: 600, tags: ['users'] }), getUser);
router.post('/joinClub/:id', AuthMiddleware, purgeCache(['users', 'clubs']), joinClub);
router.get('/isFounder', AuthMiddleware, cache({ key: 'founder', ttl: 600, tags: ['users'] }), isFounder);
router.put('/updateProfile', AuthMiddleware, purgeCache(['users']), updateProfile);
router.get('/getSidebarUser', AuthMiddleware, cache({ key: 'sidebar-user', ttl: 600, tags: ['users'] }), getSidebarUser);
router.get('/SearchUser', cache({ key: 'search-user', ttl: 600, tags: ['users'] }), searchUser);
router.get('/getPublicUser', AuthMiddleware, cache({ key: 'public-user', ttl: 600, tags: ['users'] }), getPublicUser);
router.get('/getAllUsers', cache({ key: 'all-users', ttl: 600, tags: ['users'] }), getAllUsers);

export const userRouter = router;
