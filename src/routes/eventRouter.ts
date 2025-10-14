import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { cache, purgeCache } from '../middleware/cachelayer';
import {
  createEvent,
  getEventById,
  getEventsByClub,
  getAllEvents,
  registerForEvent,
  addSpeaker,
  getSpeakers,
  verifyEventRegistration,
  getEventDetails
} from '../controller/event.controller';

const router = Router();

router.post('/event', AuthMiddleware, purgeCache(['events']), createEvent);
router.get('/event/:id', cache({ key: 'event-by-id', ttl: 600, tags: ['events'] }), getEventById);
router.get('/eventByClub/:id', AuthMiddleware, cache({ key: 'events-by-club', ttl: 600, tags: ['events'] }), getEventsByClub);
router.get('/all', cache({ key: 'all-events', ttl: 600, tags: ['events'] }), getAllEvents);
router.post('/registerEvent', AuthMiddleware, purgeCache(['events']), registerForEvent);
router.post('/addSpeakers', AuthMiddleware, purgeCache(['events']), addSpeaker);
router.get('/getSpeakers', cache({ key: 'speakers', ttl: 600, tags: ['events'] }), getSpeakers);
router.get('/ver-event', cache({ key: 'verify-event', ttl: 600, tags: ['events'] }), verifyEventRegistration);
router.get('/event-details', cache({ key: 'event-details', ttl: 600, tags: ['events'] }), getEventDetails);

export const EventRouter = router;
