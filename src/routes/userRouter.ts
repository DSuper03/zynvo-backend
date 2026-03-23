import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

import { 
  signup,
  login,
  resendEmail, 
  verifyEmail, 
  resetPassword, 
  forgotPassword
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
  leaveClub,
  isClubAdmin
} from '../controller/user.controller';
import { clerkLogin, syncWithClerk } from '../controller/auth.controller.new';

const router = Router();

//depricated routes - use auth.controller.new.ts for new routes
router.post('/signup', signup);
// Route /login through the Clerk-aware handler; it falls back to legacy password login when clerkId is absent
router.post('/login', clerkLogin);
// Keep legacy password login separately for explicit calls
router.post('/password-login', login);
router.post('/ResendEmail', resendEmail);
router.post('/verify', verifyEmail);
router.post('/forgot', forgotPassword);
router.put('/reset-password', AuthMiddleware, resetPassword);

router.post('/clerkLogin', clerkLogin);
router.post('/syncWithClerk', syncWithClerk);

router.get('/getUser', AuthMiddleware, getUser);
router.post('/joinClub/:id', AuthMiddleware, joinClub);
router.get('/isFounder', AuthMiddleware, isFounder);
router.put('/updateProfile', AuthMiddleware, updateProfile);
router.get('/getSidebarUser', AuthMiddleware, getSidebarUser);
router.get('/SearchUser', searchUser);
router.get('/getPublicUser', AuthMiddleware, getPublicUser);
router.get('/getAllUsers', getAllUsers);
router.put('/leaveClub', AuthMiddleware, leaveClub);
router.get('/isClubAdmin',AuthMiddleware, isClubAdmin);

export const userRouter = router;
