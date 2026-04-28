import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token';
import { Role } from '@prisma/client';

export interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: Role;
  };
  accessToken: string;
  refreshToken: string;
}

export const register = async (data: {
  username: string;
  email: string;
  passwordHash: string;
  role?: Role;
}): Promise<AuthResponse> => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username }
      ]
    }
  });

  if (existingUser) {
    throw new Error('Username or Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.passwordHash, salt);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
      role: data.role || 'FARMER'
    }
  });

  const tokenPayload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  };
};

export const login = async (data: {
  email: string;
  passwordHash: string;
}): Promise<AuthResponse> => {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isMatch = await bcrypt.compare(data.passwordHash, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const tokenPayload = { id: user.id, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    accessToken,
    refreshToken
  };
};

export const refresh = async (token: string) => {
  try {
    const decoded = verifyRefreshToken(token);
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const tokenPayload = { id: user.id, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    return {
      accessToken,
      refreshToken: newRefreshToken
    };
  } catch (error: any) {
    throw new Error('Invalid refresh token');
  }
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      isVerifiedExpert: true,
      reputationPoints: true,
      createdAt: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};
