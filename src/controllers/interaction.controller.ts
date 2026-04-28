import { Request, Response } from 'express';
import * as interactionService from '../services/interaction.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id: postId } = req.params;
    const { content, parentId } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await interactionService.createComment({
      postId: String(postId),
      authorId,
      content,
      parentId
    });

    res.status(201).json(comment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const { id: postId } = req.params;
    const comments = await interactionService.getCommentsByPostId(String(postId));
    res.status(200).json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const likePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const like = await interactionService.likePost(String(postId), userId);
    res.status(201).json(like);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const unlikePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await interactionService.unlikePost(String(postId), userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const savePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const save = await interactionService.savePost(String(postId), userId);
    res.status(201).json(save);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const unsavePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await interactionService.unsavePost(String(postId), userId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
