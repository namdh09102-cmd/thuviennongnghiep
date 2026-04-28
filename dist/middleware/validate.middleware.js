"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                message: 'Dữ liệu đầu vào không hợp lệ',
                errors: error.issues.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message
                }))
            });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
exports.validate = validate;
