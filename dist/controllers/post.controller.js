"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPosts = exports.deletePost = exports.updatePost = exports.createPost = exports.getPostBySlug = exports.getPosts = void 0;
const postService = __importStar(require("../services/post.service"));
const getPosts = async (req, res) => {
    try {
        const { cursor, limit, category, tags, trending } = req.query;
        if (trending === 'true') {
            const trendingPosts = await postService.getTrendingPosts();
            return res.status(200).json(trendingPosts);
        }
        let parsedTags = undefined;
        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags.map(t => String(t));
            }
            else {
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPosts = getPosts;
const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await postService.getPostBySlug(String(slug));
        res.status(200).json(post);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getPostBySlug = getPostBySlug;
const createPost = async (req, res) => {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createPost = createPost;
const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const post = await postService.updatePost(String(id), userId, req.body);
        res.status(200).json(post);
    }
    catch (error) {
        const status = error.message.includes('authorized') ? 403 : 404;
        res.status(status).json({ message: error.message });
    }
};
exports.updatePost = updatePost;
const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;
        if (!userId || !userRole) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await postService.deletePost(String(id), userId, userRole);
        res.status(200).json({ message: 'Post deleted successfully' });
    }
    catch (error) {
        const status = error.message.includes('authorized') ? 403 : 404;
        res.status(status).json({ message: error.message });
    }
};
exports.deletePost = deletePost;
const searchPosts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Query string q is required' });
        }
        const posts = await postService.searchPosts(String(q));
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchPosts = searchPosts;
