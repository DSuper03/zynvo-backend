import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AdminAuthMiddleware } from '../middleware/AdminAuthMiddleware';
import {
  registerDeviceToken,
  unregisterDeviceToken,
  testPushNotification,
  testAllUsersPushNotification,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  broadcastNotification,
} from '../controller/notification.controller';

const router = Router();

router.post('/register', AuthMiddleware, registerDeviceToken);
router.post('/unregister', AuthMiddleware, unregisterDeviceToken);
router.post('/test', AuthMiddleware, testPushNotification);
router.post('/test-all', AuthMiddleware, AdminAuthMiddleware, testAllUsersPushNotification);
router.get('/', AuthMiddleware, getNotifications);
router.post('/read', AuthMiddleware, markNotificationRead);
router.post('/read-all', AuthMiddleware, markAllNotificationsRead);
router.post('/broadcast', AuthMiddleware, AdminAuthMiddleware, broadcastNotification);

export const notificationRouter = router;
