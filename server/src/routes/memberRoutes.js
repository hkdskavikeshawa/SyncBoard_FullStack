import express from 'express';
import { getMembers } from '../controllers/memberController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/', getMembers);

export default router;
