import { Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { addCoreMembers, addWings, deleteEvent, removeCoreMembers, removeMember, TransferOwnership, updateLink } from "../controller/adminControls.controller";
import { createClubAnnouncement, deleteClubAnnouncement, updateClubAnnouncement } from "../controller/club.ann.controller";

const router = Router()

router.put('/updateLinks/:id', AuthMiddleware, updateLink);
router.put('/addWings/:id', AuthMiddleware, addWings);
router.post('/deleteEvent/:eventId', AuthMiddleware, deleteEvent);
router.post('/removeMember/:clubId', AuthMiddleware, removeMember);
router.post('/addCoreMemberes/:clubId', AuthMiddleware, addCoreMembers);
router.post('/removeCoremembers/:clubId', AuthMiddleware, removeCoreMembers);
router.put('/transferOwnership/:clubId', AuthMiddleware, TransferOwnership);

router.post('/createAnn/:clubId',AuthMiddleware, createClubAnnouncement);
router.put('/UpdateAnn/:clubId',AuthMiddleware, updateClubAnnouncement);
router.delete('/DeleteAnn/:clubId',AuthMiddleware, deleteClubAnnouncement);

export const adminControlRouter = router;