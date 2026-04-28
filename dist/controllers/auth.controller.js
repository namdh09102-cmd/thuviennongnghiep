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
exports.logout = exports.me = exports.refresh = exports.login = exports.register = void 0;
const authService = __importStar(require("../services/auth.service"));
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email and password are required' });
        }
        const result = await authService.register({
            username,
            email,
            passwordHash: password,
            role
        });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE
        });
        res.status(201).json({
            message: 'User registered successfully',
            user: result.user,
            accessToken: result.accessToken
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        const result = await authService.login({
            email,
            passwordHash: password
        });
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE
        });
        res.status(200).json({
            message: 'Logged in successfully',
            user: result.user,
            accessToken: result.accessToken
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.login = login;
const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found in cookies' });
        }
        const result = await authService.refresh(refreshToken);
        res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: COOKIE_MAX_AGE
        });
        res.status(200).json({
            accessToken: result.accessToken
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.refresh = refresh;
const me = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await authService.getUserById(req.user.id);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};
exports.me = me;
const logout = async (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
exports.logout = logout;
