import { Router, Request, Response } from 'express';
import prisma from '../db/db';
import { logger } from '../utils/logger';
import { newPWschema, signupSchema } from '../types/formtypes';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { emailService } from '../utils/emailService';
import { authUtils, VERIFICATION_TOKEN_VALIDITY } from '../utils/authUtils';

const router = Router();

router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, collegeName, avatarUrl } = req.body;
  const parsedData = signupSchema.safeParse(req.body);

  if (!parsedData.success) {
    return res.status(400).json({ 
      msg: 'Invalid input data',
      errors: parsedData.error.errors 
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isVerified: true }
    });

    if (existingUser?.isVerified) {
      return res.status(409).json({ msg: 'User already exists and verified' });
    }

    const hashedPassword = await authUtils.hashPassword(password);
    const vToken = authUtils.generateVerificationToken();

    const userData = {
      email,
      name,
      password: hashedPassword,
      collegeName: collegeName || 'not joined',
      profileAvatar: avatarUrl,
      vToken,
      expiryToken: Math.floor(Date.now() / 1000),
      ValidFor: VERIFICATION_TOKEN_VALIDITY,
    };

    const user = existingUser 
      ? await prisma.user.update({ where: { email }, data: userData })
      : await prisma.user.create({ data: userData });

    await emailService.sendVerificationEmail(name, email, vToken);

    res.status(201).json({ msg: 'Account created. Please check your email for verification.' });
  } catch (error: any) {
    logger.error('Signup error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// LOGIN ROUTE
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        profileAvatar: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Please verify your email first' });
    }

    const isValidPassword = await authUtils.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = authUtils.generateJWT({
      id: user.id, 
      email: user.email, 
      isVerified: user.isVerified 
    });

    res.status(200).json({
      msg: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileAvatar: user.profileAvatar
      }
    });
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// RESEND EMAIL
router.post('/resend-email', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true, isVerified: true }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'User already verified' });
    }

    const vToken = authUtils.generateVerificationToken();
    await prisma.user.update({
      where: { email },
      data: {
        vToken,
        expiryToken: Math.floor(Date.now() / 1000)
      }
    });

    await emailService.sendResendVerificationEmail(user.name || 'User', email, vToken);

    res.status(200).json({ msg: 'Verification email sent' });
  } catch (error: any) {
    logger.error('Resend email error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.post('/verify', async (req: Request, res: Response) => {
  const { vToken } = req.query;

  if (!vToken) {
    return res.status(400).json({ msg: 'Verification token required' });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { vToken: vToken as string },
      select: {
        id: true,
        email: true,
        name: true,
        expiryToken: true,
        ValidFor: true,
        isVerified: true
      }
    });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid verification token' });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: 'User already verified' });
    }

    if (authUtils.isTokenExpired(user.expiryToken, user.ValidFor)) {
      return res.status(400).json({ msg: 'Verification token expired' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { 
        isVerified: true,
        vToken: null
      }
    });

    const token = authUtils.generateJWT({
      id: updatedUser.id, 
      email: updatedUser.email,
      isVerified: true 
    });

    res.status(200).json({
      msg: 'Email verified successfully',
      token
    });
  } catch (error: any) {
    logger.error('Verification error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// RESET PASSWORD
router.put('/reset-password', AuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.id;
  const { currentPassword, newPassword } = req.body;

  const parsedData = newPWschema.safeParse({ password: newPassword });
  if (!parsedData.success) {
    return res.status(400).json({ 
      msg: 'Invalid password format',
      errors: parsedData.error.errors 
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isValidPassword = await authUtils.comparePassword(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: 'Current password is incorrect' });
    }

    const hashedNewPassword = await authUtils.hashPassword(newPassword);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword }
    });

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (error: any) {
    logger.error('Password reset error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET USER PROFILE
router.get('/profile', AuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        collegeName: true,
        profileAvatar: true,
        bio: true,
        course: true,
        year: true,
        tags: true,
        twitter: true,
        instagram: true,
        linkedin: true,
        clubName: true,
        isVerified: true,
        createdAt: true,
        eventAttended: {
          select: {
            event: {
              select: {
                id: true,
                EventName: true
              }
            }
          }
        },
        CreatePost: {
          select: {
            id: true,
            description: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    logger.error('Get profile error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// UPDATE PROFILE
router.put('/profile', AuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.id;
  const { bio, tags, course, year, twitter, instagram, linkedin } = req.body;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio || undefined,
        tags: tags || undefined,
        course: course || undefined,
        year: year || undefined,
        twitter: twitter || '',
        instagram: instagram || '',
        linkedin: linkedin || ''
      }
    });

    res.status(200).json({ msg: 'Profile updated successfully' });
  } catch (error: any) {
    logger.error('Update profile error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// JOIN CLUB
router.post('/join-club/:id', AuthMiddleware, async (req: Request, res: Response) => {
  const clubId = req.params.id;
  const userId = req.id;

  try {
    const [club, user] = await Promise.all([
      prisma.clubs.findUnique({
        where: { id: clubId },
        select: { name: true }
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { clubId: true, clubName: true }
      })
    ]);

    if (!club) {
      return res.status(404).json({ msg: 'Club not found' });
    }

    if (user?.clubId) {
      return res.status(400).json({ 
        msg: 'You are already a member of a club. Leave current club first.' 
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: {
        clubName: club.name,
        clubId: clubId
      }
    });

    res.status(200).json({ msg: 'Successfully joined club' });
  } catch (error: any) {
    logger.error('Join club error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// CHECK IF USER IS FOUNDER
router.get('/is-founder', AuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.id;
  const eventId = req.query.eventId as string;

  if (!eventId) {
    return res.status(400).json({ msg: 'Event ID required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const [club, event] = await Promise.all([
      prisma.clubs.findUnique({
        where: { founderEmail: user.email },
        select: { id: true, name: true }
      }),
      prisma.event.findUnique({
        where: { id: eventId },
        select: { clubId: true }
      })
    ]);

    if (!club || !event) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    if (club.id !== event.clubId) {
      return res.status(403).json({ msg: 'Not authorized for this event' });
    }

    res.status(200).json({ msg: 'Founder verified' });
  } catch (error: any) {
    logger.error('Founder check error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// SEARCH USERS
router.get('/search', async (req: Request, res: Response) => {
  const { name, page = '1', limit = '10' } = req.query;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ msg: 'Search name is required' });
  }

  const pageNum = parseInt(page as string);
  const limitNum = Math.min(parseInt(limit as string), 50);
  const skip = (pageNum - 1) * limitNum;

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name.trim(),
          mode: 'insensitive'
        },
        isVerified: true
      },
      select: {
        id: true,
        name: true,
        profileAvatar: true,
        collegeName: true
      },
      take: limitNum,
      skip
    });

    res.status(200).json({ users });
  } catch (error: any) {
    logger.error('Search users error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

router.get('/public/:id', async (req: Request, res: Response) => {
  const userId = req.params.id;

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        collegeName: true,
        profileAvatar: true,
        bio: true,
        course: true,
        year: true,
        tags: true,
        twitter: true,
        instagram: true,
        linkedin: true,
        clubName: true,
        createdAt: true,
        eventAttended: {
          select: {
            event: {
              select: {
                id: true,
                EventName: true
              }
            }
          }
        },
        CreatePost: {
          select: {
            id: true,
            description: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error: any) {
    logger.error('Get public profile error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET ALL USERS (PAGINATED)
router.get('/all', async (req: Request, res: Response) => {
  const { page = '1', limit = '10' } = req.query;
  
  const pageNum = parseInt(page as string);
  const limitNum = Math.min(parseInt(limit as string), 50);
  const skip = (pageNum - 1) * limitNum;

  try {
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: { isVerified: true },
        select: {
          id: true,
          name: true,
          profileAvatar: true,
          collegeName: true,
          clubName: true,
          year: true,
          course: true
        },
        orderBy: { createdAt: 'desc' },
        take: limitNum,
        skip
      }),
      prisma.user.count({ where: { isVerified: true } })
    ]);

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalCount / limitNum),
      currentPage: pageNum,
      totalUsers: totalCount
    });
  } catch (error: any) {
    logger.error('Get all users error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

export const userRouter = router;
