import { Request, Response } from 'express';
import * as questionService from '../services/question.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, expertId } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' });
    }

    const question = await questionService.createQuestion({
      title,
      content,
      userId,
      expertId
    });

    res.status(201).json(question);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { status, expertId, userId } = req.query;
    const questions = await questionService.getQuestions({
      status: status ? String(status) : undefined,
      expertId: expertId ? String(expertId) : undefined,
      userId: userId ? String(userId) : undefined
    });

    res.status(200).json(questions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const question = await questionService.getQuestionById(String(id));
    res.status(200).json(question);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const answer = await questionService.createAnswer({
      questionId: String(id),
      userId,
      content
    });

    res.status(201).json(answer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const acceptAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { id, answerId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await questionService.acceptAnswer(String(id), String(answerId), userId);
    res.status(200).json(result);
  } catch (error: any) {
    const status = error.message.includes('authorized') ? 403 : 404;
    res.status(status).json({ message: error.message });
  }
};
