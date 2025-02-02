import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_ACCESS_KEY, JWT_REFRESH_KEY } from '../constants/env.constant.js';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, SALT_ROUNDS } from '../constants/auth.constant.js';

// Access Token을 생성하는 함수
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, JWT_ACCESS_KEY, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
};

// Refresh Token을 생성하는 함수
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_KEY, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });
};

// Access Token을 검증하는 함수
export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_KEY);
};

// Refresh Token을 검증하는 함수
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_KEY);
};

// string을 bcrypt로 Hashing 하는 함수
export const hash = async (string) => {
  return await bcrypt.hash(string, SALT_ROUNDS);
};

// original string과 bcrypt로 Hashed 된 string을 비교하는 함수
export const compareWithHashed = async (string, hashedString) => {
  return await bcrypt.compare(string, hashedString);
};
