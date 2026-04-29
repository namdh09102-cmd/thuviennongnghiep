"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPosts = exports.deletePost = exports.updatePost = exports.getPostBySlug = exports.getTrendingPosts = exports.getPosts = exports.createPost = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const redis_1 = __importDefault(require("../config/redis"));
const slug_1 = require("../utils/slug");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const TRENDING_CACHE_KEY = 'trending_posts';
const TRENDING_CACHE_TTL = 600; // 10 minutes in seconds
const createPost = async (data) => {
    const slug = (0, slug_1.slugify)(data.title);
    const cleanContent = (0, sanitize_html_1.default)(data.content, {
        allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'span', 'br']),
        allowedAttributes: {
            ...sanitize_html_1.default.defaults.allowedAttributes,
            'img': ['src', 'alt', 'class', 'className'],
            'h3': ['class', 'className'],
        }
    });
    return prisma_1.default.post.create({
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
exports.createPost = createPost;
const getPosts = async (query) => {
    const limit = Number(query.limit) || 10;
    const cursor = query.cursor;
    const where = {};
    if (query.category) {
        where.category = { slug: query.category };
    }
    if (query.tags && query.tags.length > 0) {
        where.tags = { hasSome: query.tags };
    }
    if (query.status) {
        where.status = query.status;
    }
    else {
        where.status = 'PUBLISHED';
    }
    const posts = await prisma_1.default.post.findMany({
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
exports.getPosts = getPosts;
const getTrendingPosts = async () => {
    try {
        const cachedData = await redis_1.default.get(TRENDING_CACHE_KEY);
        if (cachedData) {
            return JSON.parse(cachedData);
        }
    }
    catch (error) {
        console.error('Redis cache read error:', error);
    }
    const trendingPosts = await prisma_1.default.post.findMany({
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
        await redis_1.default.setex(TRENDING_CACHE_KEY, TRENDING_CACHE_TTL, JSON.stringify(trendingPosts));
    }
    catch (error) {
        console.error('Redis cache write error:', error);
    }
    return trendingPosts;
};
exports.getTrendingPosts = getTrendingPosts;
const getPostBySlug = async (slug) => {
    const cacheKey = `post:${slug}`;
    try {
        const cachedPost = await redis_1.default.get(cacheKey);
        if (cachedPost) {
            return JSON.parse(cachedPost);
        }
    }
    catch (error) {
        console.error('Redis cache read error for post detail:', error);
    }
    const post = await prisma_1.default.post.findUnique({
        where: { slug },
        select: { id: true }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    const updatedPost = await prisma_1.default.post.update({
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
        await redis_1.default.setex(cacheKey, 300, JSON.stringify(updatedPost));
    }
    catch (error) {
        console.error('Redis cache write error for post detail:', error);
    }
    return updatedPost;
};
exports.getPostBySlug = getPostBySlug;
const updatePost = async (id, userId, data) => {
    const post = await prisma_1.default.post.findUnique({
        where: { id }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.authorId !== userId) {
        throw new Error('You are not authorized to update this post');
    }
    const updateData = { ...data };
    if (data.title) {
        updateData.slug = (0, slug_1.slugify)(data.title);
    }
    if (data.content) {
        updateData.content = (0, sanitize_html_1.default)(data.content, {
            allowedTags: sanitize_html_1.default.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'span', 'br']),
            allowedAttributes: {
                ...sanitize_html_1.default.defaults.allowedAttributes,
                'img': ['src', 'alt', 'class', 'className'],
                'h3': ['class', 'className'],
            }
        });
    }
    return prisma_1.default.post.update({
        where: { id },
        data: updateData
    });
};
exports.updatePost = updatePost;
const deletePost = async (id, userId, userRole) => {
    const post = await prisma_1.default.post.findUnique({
        where: { id }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    if (post.authorId !== userId && userRole !== 'ADMIN') {
        throw new Error('You are not authorized to delete this post');
    }
    return prisma_1.default.post.delete({
        where: { id }
    });
};
exports.deletePost = deletePost;
const searchPosts = async (queryStr) => {
    return prisma_1.default.post.findMany({
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
exports.searchPosts = searchPosts;
