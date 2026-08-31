import express from 'express';
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
  inviteMemberToBoard
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All board routes require authentication

router.get('/', getBoards);
router.post('/', createBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);
router.post('/:id/invite', inviteMemberToBoard);

export default router;
