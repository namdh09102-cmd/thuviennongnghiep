import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/:username', userController.getUserProfile);
router.post('/:username/follow', protect, userController.followUser);

export default router;
