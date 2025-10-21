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
  getAllUsers, 
  leaveClub
} from '../controller/user.controller';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/ResendEmail', resendEmail);
router.post('/verify', verifyEmail);
router.put('/reset-password', AuthMiddleware, resetPassword);

router.get('/getUser', AuthMiddleware, getUser);
router.post('/joinClub/:id', AuthMiddleware, joinClub);
router.get('/isFounder', AuthMiddleware, isFounder);
router.put('/updateProfile', AuthMiddleware, updateProfile);
router.get('/getSidebarUser', AuthMiddleware, getSidebarUser);
router.get('/SearchUser', cache({ key: 'search-user', ttl: 600, tags: ['users'] }), searchUser);
router.get('/getPublicUser', AuthMiddleware, cache({ key: 'public-user', ttl: 600, tags: ['users'] }), getPublicUser);
router.get('/getAllUsers', cache({ key: 'all-users', ttl: 600, tags: ['users'] }), getAllUsers);
router.put('/leaveClub', AuthMiddleware, leaveClub);

export const userRouter = router;
