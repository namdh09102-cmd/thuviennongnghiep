import { Request, Response } from 'express';
import * as postService from '../services/post.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const getPosts = async (req: Request, res: Response) => {
  try {
    const { cursor, limit, category, tags, trending } = req.query;
    
    if (trending === 'true') {
      const trendingPosts = await postService.getTrendingPosts();
      return res.status(200).json(trendingPosts);
    }

    let parsedTags: string[] | undefined = undefined;
    if (tags) {
      if (Array.isArray(tags)) {
        parsedTags = tags.map(t => String(t));
      } else {
        parsedTags = String(tags).split(',').map(t => t.trim());
      }
    }

    const result = await postService.getPosts({
      cursor: cursor ? String(cursor) : undefined,
      limit: limit ? Number(limit) : undefined,
      category: category ? String(category) : undefined,
      tags: parsedTags
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const post = await postService.getPostBySlug(String(slug));
    res.status(200).json(post);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, categoryId, tags, status } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and Content are required' });
    }

    const authorId = req.user?.id;
    if (!authorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await postService.createPost({
      title,
      content,
      authorId,
      categoryId,
      tags,
      status
    });

    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const post = await postService.updatePost(String(id), userId, req.body);
    res.status(200).json(post);
  } catch (error: any) {
    const status = error.message.includes('authorized') ? 403 : 404;
    res.status(status).json({ message: error.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId || !userRole) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await postService.deletePost(String(id), userId, userRole);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error: any) {
    const status = error.message.includes('authorized') ? 403 : 404;
    res.status(status).json({ message: error.message });
  }
};

export const searchPosts = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: 'Query string q is required' });
    }
    const posts = await postService.searchPosts(String(q));
    res.status(200).json(posts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

