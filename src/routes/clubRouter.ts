//tested
import { Request, Response, Router } from 'express';
import { logger } from '../utils/logger';
import prisma from '../db/db';
import { ClubSchema } from '../types/formtypes';
import { AuthMiddleware } from '../middlewares/AuthMiddleware';

const router = Router();

// Move specific routes BEFORE parameterized routes
router.get('/getAll', AuthMiddleware, async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  logger.info(`[${requestId}] GET /getAll - Starting request`, {
    userId: req.id,
    query: req.query
  });

  try {
    const pages = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (pages - 1) * limit;

    logger.info(`[${requestId}] Fetching clubs with pagination`, {
      page: pages,
      limit,
      skip
    });

    const resp = await prisma.clubs.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        collegeName: true,
        description: true,
        type: true,
        profilePicUrl: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    const totalData = await prisma.clubs.count();
    
    logger.info(`[${requestId}] Successfully fetched clubs`, {
      clubsCount: resp.length,
      totalData,
      totalPages: Math.ceil(totalData / limit)
    });

    res.status(200).json({
      resp,
      totalPages: Math.ceil(totalData / limit)
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error in GET /getAll`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      userId: req.id
    });
    
    console.error(`[${requestId}] Database error:`, error);
    
    res.status(500).json({
      msg: 'Error fetching clubs',
      requestId,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

//query korbo, params na , tahole id , name , collegeName diye o khoja jabe
router.get('/getClub', AuthMiddleware, async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  const { id, name, collegeName } = req.query;

  logger.info(`[${requestId}] GET /getClub - Starting request`, {
    userId: req.id,
    queryParams: { id, name, collegeName }
  });

  try {
    if (id) {
      logger.info(`[${requestId}] Searching club by ID`, { id });
      
      const response = await prisma.clubs.findFirst({
        where: { id: id as string },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
          founderEmail: true,
          facultyEmail: true,
          members: true,
        },
      });

      if (!response) {
        logger.warn(`[${requestId}] Club not found by ID`, { id });
        res.status(404).json({ 
          msg: 'no such club',
          requestId 
        });
        return;
      }

      logger.info(`[${requestId}] Club found by ID`, { 
        clubId: response.id,
        clubName: response.name 
      });
      
      res.status(200).json({ 
        msg: 'club found', 
        response,
        requestId 
      });
      return;
    } 
    else if (name && collegeName) {
      logger.info(`[${requestId}] Searching club by name and college`, { 
        name, 
        collegeName 
      });
      
      const response = await prisma.clubs.findFirst({
        where: {
          name: name as string,
          collegeName: collegeName as string,
        },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
        },
      });

      if (!response) {
        logger.warn(`[${requestId}] Club not found by name and college`, { 
          name, 
          collegeName 
        });
        res.status(404).json({ 
          msg: 'no such club',
          requestId 
        });
        return;
      }

      logger.info(`[${requestId}] Club found by name and college`, { 
        clubId: response.id 
      });
      
      res.status(200).json({ 
        msg: 'club found', 
        response,
        requestId 
      });
      return;
    }
    else if (collegeName) {
      logger.info(`[${requestId}] Searching clubs by college`, { collegeName });
      
      const response = await prisma.clubs.findMany({
        where: { 
          collegeName: collegeName as string 
        },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
          type: true,
          founderEmail: true,
          facultyEmail: true,
          profilePicUrl: true,
          members: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        },
      });

      if (!response || response.length === 0) {
        logger.warn(`[${requestId}] No clubs found for college`, { collegeName });
        res.status(200).json({ 
          msg: 'no clubs found for this college',
          requestId 
        });
        return;
      }

      logger.info(`[${requestId}] Clubs found for college`, { 
        collegeName,
        clubsCount: response.length 
      });

      res.status(200).json({ 
        msg: 'clubs found', 
        response,
        count: response.length,
        requestId
      });
      return;
    }
    else if (name) {
      logger.info(`[${requestId}] Searching clubs by name`, { name });
      
      const response = await prisma.clubs.findMany({
        where: { name: name as string },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
        },
      });

      if (!response || response.length === 0) {
        logger.warn(`[${requestId}] No clubs found by name`, { name });
        res.status(404).json({ 
          msg: 'no such club',
          requestId 
        });
        return;
      }

      logger.info(`[${requestId}] Clubs found by name`, { 
        name,
        clubsCount: response.length 
      });

      res.status(200).json({
        msg: 'clubs found, add college filter to sort out',
        response,
        requestId
      });
      return;
    }
    else {
      logger.warn(`[${requestId}] No query parameters provided`);
      res.status(400).json({ 
        msg: 'Please provide at least one parameter: id, name, or collegeName',
        requestId
      });
      return;
    }
  } catch (error: any) {
    logger.error(`[${requestId}] Error in GET /getClub`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      queryParams: { id, name, collegeName },
      userId: req.id
    });
    
    console.error(`[${requestId}] Database error:`, error);
    
    res.status(500).json({ 
      msg: 'server error',
      requestId,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
    return;
  }
});

router.get('/getClubs/:college', async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    const collegeName = decodeURIComponent(req.params.college);
    
    logger.info(`[${requestId}] GET /getClubs/:college - Starting request`, {
      collegeName,
      originalParam: req.params.college
    });

    if (!collegeName || collegeName.trim() === '') {
      logger.warn(`[${requestId}] Empty college name provided`);
      res.status(400).json({
        msg: 'College name is required',
        requestId
      });
      return;
    }
    
    const clubs = await prisma.clubs.findMany({
      where: { 
        collegeName: {
          contains: collegeName,
          mode: 'insensitive'
        }
      },
      select: {
        id: true,
        name: true,
        collegeName: true,
        description: true,
        type: true,
        founderEmail: true,
        facultyEmail: true,
        profilePicUrl: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    logger.info(`[${requestId}] Successfully fetched clubs for college`, {
      collegeName,
      clubsFound: clubs.length
    });

    res.status(200).json({
      msg: `Clubs for ${collegeName} found`,
      clubs,
      count: clubs.length,
      requestId
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error in GET /getClubs/:college`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      college: req.params.college
    });
    
    console.error(`[${requestId}] Database error:`, error);
    
    res.status(500).json({ 
      msg: 'server error',
      requestId,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

// Put parameterized routes LAST
router.get('/:id', AuthMiddleware, async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    const clubId = req.params.id;

    logger.info(`[${requestId}] GET /:id - Starting request`, {
      clubId,
      userId: req.id
    });

    if (!clubId || clubId.trim() === '') {
      logger.warn(`[${requestId}] Empty club ID provided`);
      res.status(400).json({
        msg: 'Club ID is required',
        requestId
      });
      return;
    }

    const club = await prisma.clubs.findUnique({
      where: {
        id: clubId,
      },
      select: {
        id: true,
        name: true,
        collegeName: true,
        description: true,
        type: true,
        founderEmail: true,
        clubContact: true,
        requirements: true,
        facultyEmail: true,
        profilePicUrl: true,
        wings: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            profileAvatar: true,
            course: true,
            year: true
          }
        }
      },
    });

    if (!club) {
      logger.warn(`[${requestId}] Club not found`, { clubId });
      res.status(404).json({
        msg: 'Club not found',
        requestId
      });
      return;
    }

    logger.info(`[${requestId}] Club details retrieved successfully`, {
      clubId: club.id,
      clubName: club.name,
      membersCount: club.members.length
    });

    res.status(200).json({
      msg: 'Club details retrieved successfully',
      club,
      requestId
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error in GET /:id`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      clubId: req.params.id,
      userId: req.id
    });
    
    console.error(`[${requestId}] Database error:`, error);
    
    res.status(500).json({
      msg: 'Error retrieving club details',
      requestId,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

router.post('/club', AuthMiddleware, async (req: Request, res: Response) => {
  const requestId = Math.random().toString(36).substring(7);
  
  try {
    const {
      name,
      description,
      type,
      FounderEmail,
      clubContact,
      requirements,
      facultyEmail,
      logo,
      wings
    } = req.body;

    const userId = req.id;

    logger.info(`[${requestId}] POST /club - Starting club creation`, {
      userId,
      clubName: name,
      founderEmail: FounderEmail,
      type
    });

    // Validate required fields
    if (!name || !description || !FounderEmail || !facultyEmail) {
      logger.warn(`[${requestId}] Missing required fields`, {
        hasName: !!name,
        hasDescription: !!description,
        hasFounderEmail: !!FounderEmail,
        hasFacultyEmail: !!facultyEmail
      });
      
      res.status(400).json({
        msg: 'Missing required fields: name, description, FounderEmail, facultyEmail',
        requestId
      });
      return;
    }

    // Get user's college
    logger.info(`[${requestId}] Fetching user college information`, { userId });
    
    const college = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        collegeName: true,
      },
    });

    if (!college || !college.collegeName) {
      logger.warn(`[${requestId}] User college not found`, { userId });
      res.status(400).json({
        msg: 'User college information not found. Please update your profile.',
        requestId
      });
      return;
    }

    logger.info(`[${requestId}] User college found`, { 
      collegeName: college.collegeName 
    });

    // Check if founder exists
    logger.info(`[${requestId}] Checking founder existence`, { FounderEmail });
    
    const founder = await prisma.user.findUnique({
      where: {
        email: FounderEmail,
      },
    });

    if (!founder) {
      logger.warn(`[${requestId}] Founder not found`, { FounderEmail });
      res.status(404).json({
        msg: 'founder not found, ask him to register',
        requestId
      });
      return;
    }

    logger.info(`[${requestId}] Founder found`, { 
      founderId: founder.id,
      founderName: founder.name 
    });

    // Check for duplicate club name in same college
    logger.info(`[${requestId}] Checking for duplicate club name`, { 
      name, 
      collegeName: college.collegeName 
    });
    
    const findClub = await prisma.clubs.findFirst({
      where: {
        collegeName: college.collegeName,
        name: name,
      },
    });

    if (findClub) {
      logger.warn(`[${requestId}] Duplicate club name found`, { 
        existingClubId: findClub.id,
        name,
        collegeName: college.collegeName 
      });
      
      res.status(409).json({
        msg: 'the club of this name already exists in your college, delete that or create a new club',
        existingClubId: findClub.id,
        requestId
      });
      return;
    }

    // Check if founder is already a president
    logger.info(`[${requestId}] Checking if founder is already a president`, { 
      FounderEmail 
    });
    
    const alrFounder = await prisma.clubs.findFirst({
      where: {
        founderEmail: FounderEmail
      }
    });

    if (alrFounder) {
      logger.warn(`[${requestId}] Founder is already a president`, { 
        FounderEmail,
        existingClub: alrFounder.id 
      });
      
      res.status(400).json({
        msg: "President you chose, is already a president of one club",
        existingClubId: alrFounder.id,
        requestId
      });
      return;
    }

    // Create the club
    logger.info(`[${requestId}] Creating new club`, { 
      name, 
      collegeName: college.collegeName 
    });
    
    const response = await prisma.clubs.create({
      data: {
        name: name,
        collegeName: college.collegeName,
        description: description,
        type: type,
        founderEmail: FounderEmail,
        clubContact: clubContact,
        requirements: requirements,
        facultyEmail: facultyEmail,
        profilePicUrl: logo,
        wings: wings || []
      },
    });

    if (!response) {
      logger.error(`[${requestId}] Failed to create club - no response from database`);
      res.status(500).json({
        msg: 'error in forming a club, please try again later',
        requestId
      });
      return;
    }

    logger.info(`[${requestId}] Club created successfully`, { 
      clubId: response.id,
      clubName: response.name 
    });

    // Update founder's profile to join the club
    logger.info(`[${requestId}] Adding founder to club`, { 
      FounderEmail,
      clubId: response.id 
    });
    
    const partOfClub = await prisma.user.update({
      where: {
        email: FounderEmail
      },
      data: {
        clubId: response.id,
        clubName: response.name
      }
    });

    if (!partOfClub) {
      logger.warn(`[${requestId}] Failed to add founder to club automatically`, { 
        FounderEmail,
        clubId: response.id 
      });
      
      res.status(201).json({
        msg: "club is formed, please explicitly join the club.",
        clubId: response.id,
        requestId
      });
      return;
    }

    logger.info(`[${requestId}] Club creation completed successfully`, {
      clubId: response.id,
      clubName: response.name,
      founderJoined: true
    });

    res.status(201).json({
      msg: 'club formed!',
      clubId: response.id,
      requestId
    });
    return;
    
  } catch (error: any) {
    logger.error(`[${requestId}] Error in POST /club`, {
      error: error.message,
      stack: error.stack,
      code: error.code,
      userId: req.id,
      requestBody: req.body
    });
    
    console.error(`[${requestId}] Club creation error:`, error);
    
    res.status(500).json({
      msg: 'error creating club',
      requestId,
      ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
  }
});

export const clubRouter = router;
