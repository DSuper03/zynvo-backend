import { title } from 'process';
import { z } from 'zod';

export const signupSchema = z.object({
  password: z
    .string(),
    // .min(5, 'Password must be at least 5 characters long')
    // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    // .regex(/[0-9]/, 'Password must contain at least one number')
    // .regex(/[\W_]/, 'Password must contain at least one special character'),
  email: z.string().email('invalid email id'),
  name: z.string(),
  phone: z.string().optional(),
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
  whatsappLink: z.string().optional(),
  form: z.string().optional(),
  link1: z.string().optional(),
  link2: z.string().optional(),
  link3: z.string().optional(),
  fees: z.string().optional(),
  paymentAmount: z.string().optional(),
  image: z.string().optional(),
  contactPhone: z.string().optional(),
  isPaid: z.boolean().optional(),
  isPaidEvent: z.boolean().optional(),
  qrCodeUrl: z.string().optional(),
  paymentQRCode: z.string().optional(),
  tagline: z.string().optional(),
  applicationStartDate: z.string().optional(),
  applicationEndDate: z.string().optional(),
});
