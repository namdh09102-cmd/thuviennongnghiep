import { Request, Response } from 'express';
import * as mediaService from '../services/media.service';

export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    const result = await mediaService.uploadImageToCloudinary(req.file.buffer);

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
