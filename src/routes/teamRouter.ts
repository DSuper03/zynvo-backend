import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
    createTeam,
    joinTeam,
    getTeamDetails,
    getMyTeam,
    leaveTeam,
} from '../controller/team.controller';

const router = Router();

// All team routes require authentication
router.post('/create', AuthMiddleware, createTeam);
router.post('/join', AuthMiddleware, joinTeam);
router.get('/details/:teamId', AuthMiddleware, getTeamDetails);
router.get('/my-team/:eventId', AuthMiddleware, getMyTeam);
router.delete('/leave/:teamId', AuthMiddleware, leaveTeam);

export const teamRouter = router;
