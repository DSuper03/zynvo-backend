import { z } from 'zod';

// ── Offer query params validation ──────────────────────────
export const offerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional(),
  offerType: z.enum(['COUPON', 'CREDITS', 'FREE_TRIAL', 'DISCOUNT', 'INTERNSHIP', 'CERTIFICATION']).optional(),
  eligibility: z.enum(['ALL_STUDENTS', 'SPECIFIC_COLLEGES', 'SPECIFIC_BRANCHES']).optional(),
  search: z.string().optional(),
});

// ── Create brand validation ────────────────────────────────
export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  description: z.string().min(1, 'Description is required'),
  logo: z.string().url().optional().nullable(),
  website: z.string().url().optional().nullable(),
  category: z.string().default('General'),
  isVerified: z.boolean().default(false),
});

// ── Create offer validation ────────────────────────────────
export const createOfferSchema = z.object({
  title: z.string().min(1, 'Offer title is required'),
  description: z.string().min(1, 'Description is required'),
  offerType: z.enum(['COUPON', 'CREDITS', 'FREE_TRIAL', 'DISCOUNT', 'INTERNSHIP', 'CERTIFICATION']).default('COUPON'),
  discountValue: z.string().optional().nullable(),
  eligibility: z.enum(['ALL_STUDENTS', 'SPECIFIC_COLLEGES', 'SPECIFIC_BRANCHES']).default('ALL_STUDENTS'),
  eligibleColleges: z.array(z.string()).default([]),
  eligibleBranches: z.array(z.string()).default([]),
  redemptionLink: z.string().url().optional().nullable(),
  termsAndConditions: z.string().optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  brandId: z.string().min(1, 'Brand ID is required'),
});

// ── Update offer validation (all fields optional) ──────────
export const updateOfferSchema = createOfferSchema.partial().omit({ brandId: true });
