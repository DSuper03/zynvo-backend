import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  createEvent,
  getEventById,
  getEventsByClub,
  getAllEvents,
  registerForEvent,
  addSpeaker,
  getSpeakers,
  verifyEventRegistration,
  getEventDetails,
} from '../controller/event.controller';
import {  getAllannouncements } from '../controller/event.ann.controller';

const router = Router();

router.post('/event', AuthMiddleware, createEvent);
router.get('/event/:id', getEventById);
router.get('/eventByClub/:id', AuthMiddleware, getEventsByClub);
router.get('/all', getAllEvents);
router.post('/registerEvent', AuthMiddleware, registerForEvent);
router.post('/addSpeakers', AuthMiddleware, addSpeaker);
router.get('/getSpeakers', getSpeakers);
router.get('/ver-event', verifyEventRegistration);
router.get('/event-details', getEventDetails);
router.get('/getAnn/:eventId',AuthMiddleware, getAllannouncements);


export const EventRouter = router;
