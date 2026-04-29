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
exports.acceptAnswer = exports.createAnswer = exports.getQuestionById = exports.getQuestions = exports.createQuestion = void 0;
const questionService = __importStar(require("../services/question.service"));
const createQuestion = async (req, res) => {
    try {
        const { title, content, expertId } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!title || !content) {
            return res.status(400).json({ message: 'Title and Content are required' });
        }
        const question = await questionService.createQuestion({
            title,
            content,
            userId,
            expertId
        });
        res.status(201).json(question);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createQuestion = createQuestion;
const getQuestions = async (req, res) => {
    try {
        const { status, expertId, userId } = req.query;
        const questions = await questionService.getQuestions({
            status: status ? String(status) : undefined,
            expertId: expertId ? String(expertId) : undefined,
            userId: userId ? String(userId) : undefined
        });
        res.status(200).json(questions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getQuestions = getQuestions;
const getQuestionById = async (req, res) => {
    try {
        const { id } = req.params;
        const question = await questionService.getQuestionById(String(id));
        res.status(200).json(question);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.getQuestionById = getQuestionById;
const createAnswer = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!content) {
            return res.status(400).json({ message: 'Content is required' });
        }
        const answer = await questionService.createAnswer({
            questionId: String(id),
            userId,
            content
        });
        res.status(201).json(answer);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createAnswer = createAnswer;
const acceptAnswer = async (req, res) => {
    try {
        const { id, answerId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const result = await questionService.acceptAnswer(String(id), String(answerId), userId);
        res.status(200).json(result);
    }
    catch (error) {
        const status = error.message.includes('authorized') ? 403 : 404;
        res.status(status).json({ message: error.message });
    }
};
exports.acceptAnswer = acceptAnswer;
