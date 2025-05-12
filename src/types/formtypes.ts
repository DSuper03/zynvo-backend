import { title } from 'process';
import { z } from 'zod';

export const signupSchema = z.object({
  password: z
    .string()
    .min(5, 'Password must be at least 5 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[\W_]/, 'Password must contain at least one special character'),
  email: z.string().email('invalid email id'),
  name: z.string(),
});

export const newPWschema = z.object({
  password: z.string(),
  // .min(5, "Password must be at least 5 characters long")
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[\W_]/, "Password must contain at least one special character")
});

export const postSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const ClubSchema = z.object({
  name: z.string(),
  collegeName: z.string(),
  description: z.string().optional(),
});

export const EventSchema = z.object({
  eventName: z.string(),
  description: z.string().optional(),
});
