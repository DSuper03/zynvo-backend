import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { 
  signup, 
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

// Auth routes
router.post('/signup', signup);
router.post('/ResendEmail', resendEmail);
router.post('/verify', verifyEmail);
router.put('/reset-password', AuthMiddleware, resetPassword);

// User routes
router.get('/getUser', AuthMiddleware, getUser);
router.post('/joinClub/:id', AuthMiddleware, joinClub);
router.get('/isFounder', AuthMiddleware, isFounder);
router.put('/updateProfile', AuthMiddleware, updateProfile);
router.get('/getSidebarUser', AuthMiddleware, getSidebarUser);
router.get('/SearchUser', searchUser);
router.get('/getPublicUser', AuthMiddleware, getPublicUser);
router.get('/getAllUsers', getAllUsers);

export const userRouter = router;

