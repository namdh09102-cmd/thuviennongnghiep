import prisma from '../config/prisma';
import redis from '../config/redis';
import { slugify } from '../utils/slug';
import { PostStatus } from '@prisma/client';
import sanitizeHtml from 'sanitize-html';

const TRENDING_CACHE_KEY = 'trending_posts';
const TRENDING_CACHE_TTL = 600; // 10 minutes in seconds

export interface GetPostsQuery {
  cursor?: string;
  limit?: number;
  category?: string;
  tags?: string[];
  status?: PostStatus;
}

export const createPost = async (data: {
  title: string;
  content: string;
  authorId: string;
  categoryId?: string;
  tags?: string[];
  status?: PostStatus;
}) => {
  const slug = slugify(data.title);
  const cleanContent = sanitizeHtml(data.content, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h1', 'h2', 'h3', 'span', 'br' ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      'img': ['src', 'alt', 'class', 'className'],
      'h3': ['class', 'className'],
    }
  });
  
  return prisma.post.create({
    data: {
      title: data.title,
      slug,
      content: cleanContent,
      authorId: data.authorId,
      categoryId: data.categoryId,
      tags: data.tags || [],
      status: data.status || 'DRAFT'
    }
  });
};

export const getPosts = async (query: GetPostsQuery) => {
  const limit = Number(query.limit) || 10;
  const cursor = query.cursor;

  const where: any = {};

  if (query.category) {
    where.category = { slug: query.category };
  }

  if (query.tags && query.tags.length > 0) {
    where.tags = { hasSome: query.tags };
  }

  if (query.status) {
    where.status = query.status;
  } else {
    where.status = 'PUBLISHED';
  }

  const posts = await prisma.post.findMany({
    where,
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      thumbnailUrl: true,
      tags: true,
      status: true,
      viewCount: true,
      likeCount: true,
      commentCount: true,
      createdAt: true,
      author: { select: { id: true, username: true, role: true, isVerifiedExpert: true } },
      category: { select: { id: true, name: true, slug: true } }
    },
    orderBy: { id: 'desc' }
  });

  const nextCursor = posts.length === limit ? posts[posts.length - 1].id : null;

  return {
    posts,
    nextCursor
  };
};

export const getTrendingPosts = async () => {
  try {
    const cachedData = await redis.get(TRENDING_CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error('Redis cache read error:', error);
  }

  const trendingPosts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { viewCount: 'desc' },
    take: 5,
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      thumbnailUrl: true,
      tags: true,
      status: true,
      viewCount: true,
      likeCount: true,
      commentCount: true,
      createdAt: true,
      author: { select: { id: true, username: true, role: true } },
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  try {
    await redis.setex(TRENDING_CACHE_KEY, TRENDING_CACHE_TTL, JSON.stringify(trendingPosts));
  } catch (error) {
    console.error('Redis cache write error:', error);
  }

  return trendingPosts;
};

export const getPostBySlug = async (slug: string) => {
  const cacheKey = `post:${slug}`;

  try {
    const cachedPost = await redis.get(cacheKey);
    if (cachedPost) {
      return JSON.parse(cachedPost);
    }
  } catch (error) {
    console.error('Redis cache read error for post detail:', error);
  }

  const post = await prisma.post.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!post) {
    throw new Error('Post not found');
  }

  const updatedPost = await prisma.post.update({
    where: { slug },
    data: { viewCount: { increment: 1 } },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      excerpt: true,
      thumbnailUrl: true,
      tags: true,
      status: true,
      viewCount: true,
      likeCount: true,
      commentCount: true,
      createdAt: true,
      author: { select: { id: true, username: true, role: true, isVerifiedExpert: true } },
      category: { select: { id: true, name: true, slug: true } }
    }
  });

  try {
    await redis.setex(cacheKey, 300, JSON.stringify(updatedPost));
  } catch (error) {
    console.error('Redis cache write error for post detail:', error);
  }

  return updatedPost;
};

export const updatePost = async (id: string, userId: string, data: {
  title?: string;
  content?: string;
  categoryId?: string;
  tags?: string[];
  status?: PostStatus;
}) => {
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== userId) {
    throw new Error('You are not authorized to update this post');
  }

  const updateData: any = { ...data };
  if (data.title) {
    updateData.slug = slugify(data.title);
  }
  if (data.content) {
    updateData.content = sanitizeHtml(data.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'h1', 'h2', 'h3', 'span', 'br' ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        'img': ['src', 'alt', 'class', 'className'],
        'h3': ['class', 'className'],
      }
    });
  }

  return prisma.post.update({
    where: { id },
    data: updateData
  });
};

export const deletePost = async (id: string, userId: string, userRole: string) => {
  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    throw new Error('Post not found');
  }

  if (post.authorId !== userId && userRole !== 'ADMIN') {
    throw new Error('You are not authorized to delete this post');
  }

  return prisma.post.delete({
    where: { id }
  });
};

export const searchPosts = async (queryStr: string) => {
  return prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: queryStr, mode: 'insensitive' } },
        { content: { contains: queryStr, mode: 'insensitive' } }
      ]
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      thumbnailUrl: true,
      tags: true,
      status: true,
      viewCount: true,
      likeCount: true,
      commentCount: true,
      createdAt: true,
      author: { select: { id: true, username: true, role: true } },
      category: { select: { id: true, name: true, slug: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

