"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z.string().min(3, 'Username tối thiểu 3 ký tự').max(30),
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
        role: zod_1.z.enum(['FARMER', 'EXPERT', 'ADMIN']).optional(),
    })
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Email không hợp lệ'),
        password: zod_1.z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    })
});
