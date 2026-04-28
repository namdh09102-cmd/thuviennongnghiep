"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllCategories = async () => {
    return prisma_1.default.category.findMany({
        orderBy: { name: 'asc' }
    });
};
exports.getAllCategories = getAllCategories;
