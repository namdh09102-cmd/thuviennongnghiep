"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.refresh = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const token_1 = require("../utils/token");
const register = async (data) => {
    const existingUser = await prisma_1.default.user.findFirst({
        where: {
            OR: [
                { email: data.email },
                { username: data.username }
            ]
        }
    });
    if (existingUser) {
        throw new Error('Username or Email already exists');
    }
    const salt = await bcryptjs_1.default.genSalt(10);
    const hashedPassword = await bcryptjs_1.default.hash(data.passwordHash, salt);
    const user = await prisma_1.default.user.create({
        data: {
            username: data.username,
            email: data.email,
            passwordHash: hashedPassword,
            role: data.role || 'FARMER'
        }
    });
    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = (0, token_1.generateAccessToken)(tokenPayload);
    const refreshToken = (0, token_1.generateRefreshToken)(tokenPayload);
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};
exports.register = register;
const login = async (data) => {
    const user = await prisma_1.default.user.findUnique({
        where: { email: data.email }
    });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcryptjs_1.default.compare(data.passwordHash, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = (0, token_1.generateAccessToken)(tokenPayload);
    const refreshToken = (0, token_1.generateRefreshToken)(tokenPayload);
    return {
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};
exports.login = login;
const refresh = async (token) => {
    try {
        const decoded = (0, token_1.verifyRefreshToken)(token);
        const user = await prisma_1.default.user.findUnique({
            where: { id: decoded.id }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const tokenPayload = { id: user.id, role: user.role };
        const accessToken = (0, token_1.generateAccessToken)(tokenPayload);
        const newRefreshToken = (0, token_1.generateRefreshToken)(tokenPayload);
        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }
    catch (error) {
        throw new Error('Invalid refresh token');
    }
};
exports.refresh = refresh;
const getUserById = async (id) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            email: true,
            role: true,
            isVerifiedExpert: true,
            reputationPoints: true,
            createdAt: true
        }
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};
exports.getUserById = getUserById;
