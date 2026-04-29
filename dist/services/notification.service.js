"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getNotifications = async (userId) => {
    return prisma_1.default.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 20
    });
};
exports.getNotifications = getNotifications;
const markAsRead = async (id, userId) => {
    const notification = await prisma_1.default.notification.findUnique({
        where: { id }
    });
    if (!notification) {
        throw new Error('Notification not found');
    }
    if (notification.userId !== userId) {
        throw new Error('Unauthorized');
    }
    return prisma_1.default.notification.update({
        where: { id },
        data: { read: true }
    });
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (userId) => {
    return prisma_1.default.notification.updateMany({
        where: { userId, read: false },
        data: { read: true }
    });
};
exports.markAllAsRead = markAllAsRead;
const createNotification = async (data) => {
    return prisma_1.default.notification.create({
        data: {
            userId: data.userId,
            type: data.type,
            data: data.data,
            read: false
        }
    });
};
exports.createNotification = createNotification;
