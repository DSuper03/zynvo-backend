import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import {
  registerDeviceToken,
  unregisterDeviceToken,
  testPushNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controller/notification.controller';

const router = Router();

router.post('/register', AuthMiddleware, registerDeviceToken);
router.post('/unregister', AuthMiddleware, unregisterDeviceToken);
router.post('/test', AuthMiddleware, testPushNotification);
router.get('/', AuthMiddleware, getNotifications);
router.post('/read', AuthMiddleware, markNotificationRead);
router.post('/read-all', AuthMiddleware, markAllNotificationsRead);

export const notificationRouter = router;
