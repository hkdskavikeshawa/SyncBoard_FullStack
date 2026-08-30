import express from 'express';
import { 
  getUserNotifications, 
  markNotificationsRead, 
  clearUserNotifications 
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserNotifications);
router.put('/read', markNotificationsRead);
router.delete('/', clearUserNotifications);

export default router;
