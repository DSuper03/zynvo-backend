import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { ClubHeadAuthMiddleware } from '../middleware/ClubHeadAuthMiddleware';
import { SpecificClubHeadAuthMiddleware } from '../middleware/ClubHeadAuthMiddleware';
import { AdminCoreAuthMiddleware } from '../middleware/AdminCoreAuthMiddleware';
import {
  createEvent,
  getEventById,
  getEventsByClub,
  getAllEvents,
  registerForEvent,
  addSpeaker,
  getSpeakers,
  verifyEventRegistration,
  eventAttendees,
  getEventDetails,
} from '../controller/event.controller';
import { 
  getAllannouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement 
} from '../controller/event.ann.controller';
import{addToGallery,
    getEventGallery,
    updateGalleryItem,
    deleteGalleryItem
} from '../controller/event.controller';

const router = Router();

router.post('/event', AuthMiddleware, AdminCoreAuthMiddleware, createEvent);
router.get('/event/:id', getEventById);
router.get('/eventByClub/:id', AuthMiddleware, getEventsByClub);
router.get('/all', getAllEvents);
router.post('/registerEvent', AuthMiddleware, registerForEvent);
router.post('/addSpeakers',AuthMiddleware,SpecificClubHeadAuthMiddleware, addSpeaker);
router.get('/getSpeakers', getSpeakers);
router.get('/ver-event', verifyEventRegistration);
router.get('/event-details', getEventDetails);
router.get('/participants/:eventId', AuthMiddleware, AdminCoreAuthMiddleware, eventAttendees);
router.get('/getAnn/:eventId',AuthMiddleware, getAllannouncements);
router.post('/announcement/:eventId',AuthMiddleware, SpecificClubHeadAuthMiddleware, createAnnouncement);
router.put('/announcement/:eventId',AuthMiddleware, SpecificClubHeadAuthMiddleware, updateAnnouncement);
router.delete('/announcement/:eventId',AuthMiddleware, SpecificClubHeadAuthMiddleware, deleteAnnouncement);
router.post('/:eventId/gallery', SpecificClubHeadAuthMiddleware, addToGallery);
router.get('/:eventId/gallery', getEventGallery);
router.put('/:eventId/gallery',AuthMiddleware, SpecificClubHeadAuthMiddleware, updateGalleryItem);
router.delete('/:eventId/gallery',AuthMiddleware, SpecificClubHeadAuthMiddleware, deleteGalleryItem);

export const EventRouter = router;
