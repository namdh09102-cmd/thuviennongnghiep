import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const followUser = async (req: AuthRequest, res: Response) => {
  try {
    const { username } = req.params;
    const followerId = req.user?.id;

    if (!followerId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await userService.followUser(followerId, String(username));
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const profile = await userService.getUserProfile(String(username));
    res.status(200).json(profile);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
