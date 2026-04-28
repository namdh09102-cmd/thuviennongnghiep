import { Request, Response } from 'express';
import * as categoryService from '../services/category.service';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
