"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsavePost = exports.savePost = exports.unlikePost = exports.likePost = exports.getCommentsByPostId = exports.createComment = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createComment = async (data) => {
    const post = await prisma_1.default.post.findUnique({
        where: { id: data.postId }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: data.authorId }
    });
    const isExpertAnswer = user?.role === 'EXPERT';
    if (data.parentId) {
        const parentComment = await prisma_1.default.comment.findUnique({
            where: { id: data.parentId }
        });
        if (!parentComment) {
            throw new Error('Parent comment not found');
        }
        if (parentComment.parentId) {
            throw new Error('Maximum comment nesting level reached');
        }
    }
    const [comment] = await prisma_1.default.$transaction([
        prisma_1.default.comment.create({
            data: {
                postId: data.postId,
                authorId: data.authorId,
                content: data.content,
                parentId: data.parentId || null,
                isExpertAnswer
            },
            include: {
                author: { select: { id: true, username: true, role: true } }
            }
        }),
        prisma_1.default.post.update({
            where: { id: data.postId },
            data: { commentCount: { increment: 1 } }
        }),
        prisma_1.default.user.update({
            where: { id: data.authorId },
            data: { reputationPoints: { increment: isExpertAnswer ? 10 : 2 } }
        })
    ]);
    return comment;
};
exports.createComment = createComment;
const getCommentsByPostId = async (postId) => {
    const comments = await prisma_1.default.comment.findMany({
        where: {
            postId,
            parentId: null
        },
        take: 10,
        include: {
            author: { select: { id: true, username: true, role: true, isVerifiedExpert: true } },
            replies: {
                include: {
                    author: { select: { id: true, username: true, role: true, isVerifiedExpert: true } }
                },
                orderBy: { createdAt: 'asc' }
            }
        },
        orderBy: { createdAt: 'desc' }
    });
    return comments;
};
exports.getCommentsByPostId = getCommentsByPostId;
const likePost = async (postId, userId) => {
    const existingLike = await prisma_1.default.postLike.findUnique({
        where: {
            postId_userId: { postId, userId }
        }
    });
    if (existingLike) {
        throw new Error('You have already liked this post');
    }
    const post = await prisma_1.default.post.findUnique({
        where: { id: postId }
    });
    if (!post) {
        throw new Error('Post not found');
    }
    const [like] = await prisma_1.default.$transaction([
        prisma_1.default.postLike.create({
            data: { postId, userId }
        }),
        prisma_1.default.post.update({
            where: { id: postId },
            data: { likeCount: { increment: 1 } }
        }),
        prisma_1.default.user.update({
            where: { id: post.authorId },
            data: { reputationPoints: { increment: 5 } }
        })
    ]);
    return like;
};
exports.likePost = likePost;
const unlikePost = async (postId, userId) => {
    const existingLike = await prisma_1.default.postLike.findUnique({
        where: {
            postId_userId: { postId, userId }
        }
    });
    if (!existingLike) {
        throw new Error('You have not liked this post yet');
    }
    await prisma_1.default.$transaction([
        prisma_1.default.postLike.delete({
            where: {
                postId_userId: { postId, userId }
            }
        }),
        prisma_1.default.post.update({
            where: { id: postId },
            data: { likeCount: { decrement: 1 } }
        })
    ]);
    return { message: 'Unliked successfully' };
};
exports.unlikePost = unlikePost;
const savePost = async (postId, userId) => {
    const existingSave = await prisma_1.default.postSave.findUnique({
        where: {
            postId_userId: { postId, userId }
        }
    });
    if (existingSave) {
        throw new Error('You have already saved this post');
    }
    return prisma_1.default.postSave.create({
        data: { postId, userId }
    });
};
exports.savePost = savePost;
const unsavePost = async (postId, userId) => {
    const existingSave = await prisma_1.default.postSave.findUnique({
        where: {
            postId_userId: { postId, userId }
        }
    });
    if (!existingSave) {
        throw new Error('You have not saved this post yet');
    }
    await prisma_1.default.postSave.delete({
        where: {
            postId_userId: { postId, userId }
        }
    });
    return { message: 'Unsaved successfully' };
};
exports.unsavePost = unsavePost;
