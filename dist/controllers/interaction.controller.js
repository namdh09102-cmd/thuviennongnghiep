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
exports.unsavePost = exports.savePost = exports.unlikePost = exports.likePost = exports.getComments = exports.createComment = void 0;
const interactionService = __importStar(require("../services/interaction.service"));
const createComment = async (req, res) => {
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
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createComment = createComment;
const getComments = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const comments = await interactionService.getCommentsByPostId(String(postId));
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getComments = getComments;
const likePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const like = await interactionService.likePost(String(postId), userId);
        res.status(201).json(like);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.likePost = likePost;
const unlikePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await interactionService.unlikePost(String(postId), userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.unlikePost = unlikePost;
const savePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const save = await interactionService.savePost(String(postId), userId);
        res.status(201).json(save);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.savePost = savePost;
const unsavePost = async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await interactionService.unsavePost(String(postId), userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.unsavePost = unsavePost;
