import { Router } from 'express';
import * as questionController from '../controllers/question.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.get('/', questionController.getQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', protect, questionController.createQuestion);
router.post('/:id/answers', protect, questionController.createAnswer);
router.put('/:id/answers/:answerId/accept', protect, questionController.acceptAnswer);

export default router;
