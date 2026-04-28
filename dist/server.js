"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("./config/prisma"));
const redis_1 = __importDefault(require("./config/redis"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const log_middleware_1 = require("./middleware/log.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use(log_middleware_1.logRequest);
app.use((0, helmet_1.default)());
// 2. Rate limit: 100 requests / 15 phút / IP
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau 15 phút' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
// 3. CORS chỉ cho phép domain frontend
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use((0, cors_1.default)({
    origin: frontendUrl,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/v1/posts', post_routes_1.default);
app.use('/api/v1/auth', auth_routes_1.default);
app.use('/api/v1/media', media_routes_1.default);
app.use('/api/v1/users', user_routes_1.default);
app.use('/api/v1/categories', category_routes_1.default);
// Health check route
app.get('/api/health', async (req, res) => {
    let dbStatus = 'OK';
    let redisStatus = 'OK';
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
    }
    catch (error) {
        dbStatus = 'ERROR';
    }
    try {
        const ping = await redis_1.default.ping();
        if (ping !== 'PONG')
            redisStatus = 'ERROR';
    }
    catch (error) {
        redisStatus = 'ERROR';
    }
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        services: {
            database: dbStatus,
            redis: redisStatus
        }
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Secure Server is running on port ${PORT}`);
});
exports.default = app;
