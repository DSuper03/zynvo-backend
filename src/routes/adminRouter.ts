import { Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { SpecificClubHeadAuthMiddleware } from "../middleware/ClubHeadAuthMiddleware";
import { addCoreMembers, addWings, deleteEvent, removeCoreMembers, removeMember, TransferOwnership, updateEventLink, updateLink } from "../controller/adminControls.controller";
import { createClubAnnouncement, deleteClubAnnouncement, updateClubAnnouncement } from "../controller/club.ann.controller";
import { createAnnouncement, deleteAnnouncement, updateAnnouncement } from "../controller/event.ann.controller";

const router = Router()
router.put('/updateClubLinks/:id', AuthMiddleware, updateLink);
router.put('/addWings/:id', AuthMiddleware, addWings);
router.post('/deleteEvent/:eventId', AuthMiddleware, SpecificClubHeadAuthMiddleware, deleteEvent);
router.post('/removeMember/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, removeMember);
router.post('/addCoreMembers/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, addCoreMembers);
router.post('/removeCoremembers/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, removeCoreMembers);
router.put('/transferOwnership/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, TransferOwnership);
router.put('/updateEventLinks/:eventId', AuthMiddleware, SpecificClubHeadAuthMiddleware, updateEventLink);

//========================Club Announcement Routes==============================
router.post('/createAnn/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, createClubAnnouncement);
//?annId=""  here
router.put('/UpdateAnn/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, updateClubAnnouncement);
router.delete('/DeleteAnn/:clubId', AuthMiddleware, SpecificClubHeadAuthMiddleware, deleteClubAnnouncement);



//========================Event Announcement Routes==============================
router.post('/createEventAnn/:eventId', AuthMiddleware, SpecificClubHeadAuthMiddleware, createAnnouncement);
//?annId=""  here
router.put('/UpdateEventAnn/:eventId', AuthMiddleware, SpecificClubHeadAuthMiddleware, updateAnnouncement);
router.delete('/DeleteEventAnn/:eventId', AuthMiddleware, SpecificClubHeadAuthMiddleware, deleteAnnouncement);

export const adminControlRouter = router;