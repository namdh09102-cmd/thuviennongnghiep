"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptAnswer = exports.createAnswer = exports.getQuestionById = exports.getQuestions = exports.createQuestion = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createQuestion = async (data) => {
    return prisma_1.default.question.create({
        data: {
            title: data.title,
            content: data.content,
            userId: data.userId,
            expertId: data.expertId || null,
            status: 'OPEN'
        },
        include: {
            user: { select: { id: true, username: true, role: true } },
            expert: { select: { id: true, username: true, role: true } }
        }
    });
};
exports.createQuestion = createQuestion;
const getQuestions = async (query) => {
    const where = {};
    if (query.status) {
        where.status = query.status;
    }
    if (query.expertId) {
        where.expertId = query.expertId;
    }
    if (query.userId) {
        where.userId = query.userId;
    }
    return prisma_1.default.question.findMany({
        where,
        include: {
            user: { select: { id: true, username: true, role: true } },
            expert: { select: { id: true, username: true, role: true } },
            _count: { select: { answers: true } }
        },
        orderBy: { createdAt: 'desc' }
    });
};
exports.getQuestions = getQuestions;
const getQuestionById = async (id) => {
    const question = await prisma_1.default.question.findUnique({
        where: { id },
        include: {
            user: { select: { id: true, username: true, role: true } },
            expert: { select: { id: true, username: true, role: true } },
            answers: {
                include: {
                    user: { select: { id: true, username: true, role: true, isVerifiedExpert: true } }
                },
                orderBy: { createdAt: 'asc' }
            }
        }
    });
    if (!question) {
        throw new Error('Question not found');
    }
    return question;
};
exports.getQuestionById = getQuestionById;
const createAnswer = async (data) => {
    const question = await prisma_1.default.question.findUnique({
        where: { id: data.questionId }
    });
    if (!question) {
        throw new Error('Question not found');
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: data.userId }
    });
    const isExpert = user?.role === 'EXPERT';
    const [answer] = await prisma_1.default.$transaction([
        prisma_1.default.answer.create({
            data: {
                questionId: data.questionId,
                userId: data.userId,
                content: data.content
            },
            include: {
                user: { select: { id: true, username: true, role: true } }
            }
        }),
        // Nếu là Expert trả lời, tự động cập nhật status của Question thành ANSWERED
        prisma_1.default.question.update({
            where: { id: data.questionId },
            data: { status: isExpert ? 'ANSWERED' : question.status }
        }),
        // Tăng điểm uy tín
        prisma_1.default.user.update({
            where: { id: data.userId },
            data: { reputationPoints: { increment: isExpert ? 15 : 5 } }
        })
    ]);
    return answer;
};
exports.createAnswer = createAnswer;
const acceptAnswer = async (questionId, answerId, userId) => {
    const question = await prisma_1.default.question.findUnique({
        where: { id: questionId }
    });
    if (!question) {
        throw new Error('Question not found');
    }
    if (question.userId !== userId) {
        throw new Error('You are not authorized to accept an answer for this question');
    }
    const answer = await prisma_1.default.answer.findUnique({
        where: { id: answerId }
    });
    if (!answer || answer.questionId !== questionId) {
        throw new Error('Answer not found or does not belong to this question');
    }
    await prisma_1.default.$transaction([
        prisma_1.default.answer.update({
            where: { id: answerId },
            data: { isAccepted: true }
        }),
        prisma_1.default.question.update({
            where: { id: questionId },
            data: { status: 'CLOSED' }
        }),
        // Thưởng thêm điểm cho người trả lời được chấp nhận
        prisma_1.default.user.update({
            where: { id: answer.userId },
            data: { reputationPoints: { increment: 30 } }
        })
    ]);
    return { message: 'Answer accepted successfully' };
};
exports.acceptAnswer = acceptAnswer;
