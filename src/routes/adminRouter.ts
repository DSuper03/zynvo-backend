import { Router } from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { addWings, updateLink } from "../controller/club.controller";
import { deleteEvent } from "../controller/event.controller";

const router = Router()

router.put('/updateLinks/:id', AuthMiddleware, updateLink);
router.put('/addWings/:id', AuthMiddleware, addWings);
router.post('/deleteEvent/:eventId', AuthMiddleware, deleteEvent);
router.post('/removeMember', AuthMiddleware)
export const adminControlRouter = router;