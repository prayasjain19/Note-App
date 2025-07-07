import { Router } from 'express';
import { NoteController } from '../controllers/NoteController';
import { authMiddleware } from '../../middlewares/auth.middleware';



const router = Router();

// ✅ This is correct
router.use(authMiddleware);

router.post('/', NoteController.create);
router.get('/', NoteController.list);
router.delete('/:id', NoteController.remove);
router.patch('/:id', NoteController.update);

export default router;
