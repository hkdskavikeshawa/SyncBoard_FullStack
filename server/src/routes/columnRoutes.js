import express from 'express';
import { getColumns, createColumn, updateColumn, deleteColumn } from '../controllers/columnController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getColumns);
router.post('/', createColumn);
router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);

export default router;
