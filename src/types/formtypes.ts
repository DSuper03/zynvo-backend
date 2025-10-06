import { z } from 'zod';

export const signupSchema = z.object({
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  collegeName: z.string().optional(),
  avatarUrl: z.string().url().optional()
});

export const newPWschema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character')
});

export const postSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
});

export const ClubSchema = z.object({
  name: z.string().min(1, 'Club name is required'),
  collegeName: z.string().min(1, 'College name is required'),
  description: z.string().optional(),
});

export const EventSchema = z.object({
  eventName: z.string().min(1, 'Event name is required'),
  description: z.string().optional(),
});
