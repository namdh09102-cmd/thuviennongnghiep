"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const redis = new ioredis_1.default({
    host: redisHost,
    port: redisPort,
    password: redisPassword,
    lazyConnect: true, // Đổi sang true để tránh crash nếu Redis chưa chạy ngay lúc khởi động
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});
// Thực hiện connect thủ công hoặc để ioredis tự connect khi có lệnh
redis.connect().catch((err) => {
    console.error('Redis failed to connect on startup:', err.message);
});
redis.on('connect', () => {
    console.log('Redis client connected successfully');
});
redis.on('error', (error) => {
    console.error('Redis client error:', error.message);
});
exports.default = redis;
