import { Router } from 'express';
import * as postController from '../controllers/post.controller';
import * as interactionController from '../controllers/interaction.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Post CRUD
router.get('/', postController.getPosts);
router.get('/search', postController.searchPosts);
router.get('/:slug', postController.getPostBySlug);
router.post('/', protect, postController.createPost);
router.put('/:id', protect, postController.updatePost);
router.delete('/:id', protect, postController.deletePost);

// Interaction Routes
router.post('/:id/comments', protect, interactionController.createComment);
router.get('/:id/comments', interactionController.getComments);
router.post('/:id/like', protect, interactionController.likePost);
router.delete('/:id/like', protect, interactionController.unlikePost);
router.post('/:id/save', protect, interactionController.savePost);
router.delete('/:id/save', protect, interactionController.unsavePost);

export default router;
