import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username tối thiểu 3 ký tự').max(30),
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    role: z.enum(['FARMER', 'EXPERT', 'ADMIN']).optional(),
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  })
});
