import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  registerDeviceToken,
  unregisterDeviceToken,
  testPushNotification,
} from '../controller/notification.controller';

const router = Router();

router.post('/register', AuthMiddleware, registerDeviceToken);
router.post('/unregister', AuthMiddleware, unregisterDeviceToken);
router.post('/test', AuthMiddleware, testPushNotification);

export const notificationRouter = router;
