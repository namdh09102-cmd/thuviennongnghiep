import { Router } from 'express';
import * as mediaController from '../controllers/media.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/upload', protect, upload.single('file'), mediaController.uploadMedia);

export default router;
