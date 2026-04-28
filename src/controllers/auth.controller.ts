import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth.middleware';

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export const register = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
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
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await authService.getUserById(req.user.id);
    res.status(200).json(user);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
