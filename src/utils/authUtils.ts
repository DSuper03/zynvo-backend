import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const TOKEN_EXPIRY = '24h';
export const VERIFICATION_TOKEN_VALIDITY = 24 * 60 * 60 * 1000; 
export const BCRYPT_SALT_ROUNDS = 12;

export const authUtils = {
  generateVerificationToken: (): string => {
    return crypto.randomBytes(20).toString('hex');
  },

  hashPassword: async (password: string): Promise<string> => {
    return bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  },

  comparePassword: async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  },

  generateJWT: (payload: object): string => {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: TOKEN_EXPIRY });
  },

  isTokenExpired: (expiryTime: number, validFor: number): boolean => {
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenAge = currentTime - expiryTime;
    return tokenAge > validFor / 1000;
  }
};
