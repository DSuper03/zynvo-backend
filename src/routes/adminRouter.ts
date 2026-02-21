import { Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { addCoreMembers, addWings, deleteEvent, removeCoreMembers, removeMember, TransferOwnership, updateEventLink, updateLink } from "../controller/adminControls.controller";
import { createClubAnnouncement, deleteClubAnnouncement, updateClubAnnouncement } from "../controller/club.ann.controller";
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "../controller/event.ann.controller";

const router = Router()
//hello
router.put('/updateClubLinks/:id', AuthMiddleware, updateLink);
router.put('/addWings/:id', AuthMiddleware, addWings);
router.post('/deleteEvent/:eventId', AuthMiddleware, deleteEvent);
router.post('/removeMember/:clubId', AuthMiddleware, removeMember);
router.post('/addCoreMembers/:clubId', AuthMiddleware, addCoreMembers);
router.post('/removeCoremembers/:clubId', AuthMiddleware, removeCoreMembers);
router.put('/transferOwnership/:clubId', AuthMiddleware, TransferOwnership);
router.put('/updateEventLinks/:eventId', AuthMiddleware, updateEventLink);

//========================Club Announcement Routes==============================
router.post('/createAnn/:clubId',AuthMiddleware, createClubAnnouncement);
//?annId=""  here
router.put('/UpdateAnn/:clubId',AuthMiddleware, updateClubAnnouncement);
router.delete('/DeleteAnn/:clubId',AuthMiddleware, deleteClubAnnouncement);



//========================Event Announcement Routes==============================
router.post('/createEventAnn/:eventId',AuthMiddleware, createAnnouncement);
//?annId=""  here
router.put('/UpdateEventAnn/:eventId',AuthMiddleware, updateAnnouncement);
router.delete('/DeleteEventAnn/:eventId',AuthMiddleware, deleteAnnouncement);

export const adminControlRouter = router;