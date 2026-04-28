"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.followUser = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const followUser = async (followerId, targetUsername) => {
    const targetUser = await prisma_1.default.user.findUnique({
        where: { username: targetUsername }
    });
    if (!targetUser) {
        throw new Error('User to follow not found');
    }
    if (targetUser.id === followerId) {
        throw new Error('You cannot follow yourself');
    }
    const existingFollow = await prisma_1.default.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId: targetUser.id
            }
        }
    });
    if (existingFollow) {
        await prisma_1.default.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId: targetUser.id
                }
            }
        });
        return { message: 'Unfollowed successfully', isFollowing: false };
    }
    await prisma_1.default.follow.create({
        data: {
            followerId,
            followingId: targetUser.id
        }
    });
    return { message: 'Followed successfully', isFollowing: true };
};
exports.followUser = followUser;
const getUserProfile = async (username) => {
    const user = await prisma_1.default.user.findUnique({
        where: { username },
        include: {
            posts: {
                where: { status: 'PUBLISHED' },
                orderBy: { createdAt: 'desc' },
                include: {
                    author: { select: { username: true, role: true } }
                }
            },
            _count: {
                select: {
                    followers: true,
                    following: true,
                    posts: true
                }
            }
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
};
exports.getUserProfile = getUserProfile;
