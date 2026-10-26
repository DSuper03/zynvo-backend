import { Hono } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../types';
import { authMiddleware, adminAuthMiddleware, adminCoreAuthMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';

const router = new Hono<HonoEnv>();

// ── Validation schemas ────────────────────────────────────────

const offerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  category: z.string().optional(),
  offerType: z.enum(['COUPON', 'CREDITS', 'FREE_TRIAL', 'DISCOUNT', 'INTERNSHIP', 'CERTIFICATION']).optional(),
  eligibility: z.enum(['ALL_STUDENTS', 'SPECIFIC_COLLEGES', 'SPECIFIC_BRANCHES']).optional(),
  search: z.string().optional(),
});

const createBrandSchema = z.object({
  name: z.string().min(1), description: z.string().min(1),
  logo: z.string().url().optional().nullable(), website: z.string().url().optional().nullable(),
  category: z.string().default('General'), isVerified: z.boolean().default(false),
});

const createOfferSchema = z.object({
  title: z.string().min(1), description: z.string().min(1),
  offerType: z.enum(['COUPON', 'CREDITS', 'FREE_TRIAL', 'DISCOUNT', 'INTERNSHIP', 'CERTIFICATION']).default('COUPON'),
  discountValue: z.string().optional().nullable(),
  eligibility: z.enum(['ALL_STUDENTS', 'SPECIFIC_COLLEGES', 'SPECIFIC_BRANCHES']).default('ALL_STUDENTS'),
  eligibleColleges: z.array(z.string()).default([]),
  eligibleBranches: z.array(z.string()).default([]),
  redemptionLink: z.string().url().optional().nullable(),
  termsAndConditions: z.string().optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional().nullable(),
  brandId: z.string().min(1),
});

const updateOfferSchema = createOfferSchema.partial().omit({ brandId: true });

const offerPublicSelect = {
  id: true, title: true, description: true, offerType: true, discountValue: true,
  eligibility: true, eligibleColleges: true, eligibleBranches: true, redemptionLink: true,
  startDate: true, endDate: true, createdAt: true,
  brand: { select: { id: true, name: true, logo: true, description: true, website: true, category: true, isVerified: true } },
} as const;

// ── GET /all ──────────────────────────────────────────────────

router.get('/all', async (c) => {
  const requestId = generateRequestId();
  const parsed = offerQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return jsonError(c, requestId, 'Invalid query params', 400);
  const { page, limit, category, offerType, eligibility } = parsed.data;
  const skip = (page - 1) * limit;
  const now = new Date();
  const where: any = { isActive: true, startDate: { lte: now }, OR: [{ endDate: null }, { endDate: { gte: now } }] };
  if (offerType) where.offerType = offerType;
  if (eligibility) where.eligibility = eligibility;
  if (category) where.brand = { category: { equals: category, mode: 'insensitive' } };
  const prisma = c.get('prisma');
  const [offers, total] = await Promise.all([
    prisma.offer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: offerPublicSelect }),
    prisma.offer.count({ where }),
  ]);
  return c.json({ offers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }, 200);
});

// ── GET /search ───────────────────────────────────────────────

router.get('/search', async (c) => {
  const requestId = generateRequestId();
  const parsed = offerQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return jsonError(c, requestId, 'Invalid query params', 400);
  const { page, limit, search } = parsed.data;
  if (!search?.trim()) return jsonError(c, requestId, 'Search query is required', 400);
  const skip = (page - 1) * limit;
  const now = new Date();
  const term = search.trim();
  const where: any = {
    isActive: true, startDate: { lte: now },
    AND: [
      { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      { OR: [{ title: { contains: term, mode: 'insensitive' } }, { description: { contains: term, mode: 'insensitive' } }, { brand: { name: { contains: term, mode: 'insensitive' } } }] },
    ],
  };
  const prisma = c.get('prisma');
  const [offers, total] = await Promise.all([
    prisma.offer.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' }, select: offerPublicSelect }),
    prisma.offer.count({ where }),
  ]);
  return c.json({ offers, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }, 200);
});

// ── GET /brand/:brandId ───────────────────────────────────────

router.get('/brand/:brandId', async (c) => {
  const requestId = generateRequestId();
  const brandId = c.req.param('brandId');
  const now = new Date();
  const prisma = c.get('prisma');
  const brand = await prisma.brand.findUnique({
    where: { id: brandId },
    select: {
      id: true, name: true, logo: true, description: true, website: true, category: true, isVerified: true,
      offers: {
        where: { isActive: true, startDate: { lte: now }, OR: [{ endDate: null }, { endDate: { gte: now } }] },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, description: true, offerType: true, discountValue: true, eligibility: true, redemptionLink: true, startDate: true, endDate: true, createdAt: true },
      },
    },
  });
  if (!brand) return jsonError(c, requestId, 'Brand not found', 404);
  return c.json({ brand }, 200);
});

// ── GET /saved/me ─────────────────────────────────────────────

router.get('/saved/me', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  const saves = await prisma.offerSave.findMany({
    where: { userId }, orderBy: { savedAt: 'desc' },
    select: {
      id: true, savedAt: true,
      offer: { select: { id: true, title: true, description: true, offerType: true, discountValue: true, startDate: true, endDate: true, isActive: true, brand: { select: { id: true, name: true, logo: true, category: true, isVerified: true } } } },
    },
  });
  return c.json({ savedOffers: saves }, 200);
});

// ── POST /:offerId/save ───────────────────────────────────────

router.post('/:offerId/save', authMiddleware, async (c) => {
  const offerId = c.req.param('offerId');
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  const existing = await prisma.offerSave.findUnique({ where: { offerId_userId: { offerId, userId } } });
  if (existing) {
    await prisma.offerSave.delete({ where: { id: existing.id } });
    return c.json({ msg: 'Offer unsaved', saved: false }, 200);
  }
  await prisma.offerSave.create({ data: { offerId, userId } });
  return c.json({ msg: 'Offer saved', saved: true }, 201);
});

// ── POST /:offerId/view & click ───────────────────────────────

router.post('/:offerId/view', async (c) => {
  const offerId = c.req.param('offerId');
  const prisma = c.get('prisma');
  try { await prisma.offer.update({ where: { id: offerId }, data: { viewCount: { increment: 1 } } }); } catch {}
  return c.json({ msg: 'View tracked' }, 200);
});

router.post('/:offerId/click', async (c) => {
  const offerId = c.req.param('offerId');
  const prisma = c.get('prisma');
  try { await prisma.offer.update({ where: { id: offerId }, data: { clickCount: { increment: 1 } } }); } catch {}
  return c.json({ msg: 'Click tracked' }, 200);
});

// ── GET /analytics/all (admin) ────────────────────────────────

router.get('/analytics/all', authMiddleware, adminCoreAuthMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const offers = await prisma.offer.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, isActive: true, viewCount: true, clickCount: true, createdAt: true, endDate: true, brand: { select: { name: true, category: true } }, _count: { select: { saves: true } } },
  });
  const analytics = offers.map((o) => ({ id: o.id, title: o.title, brand: o.brand.name, category: o.brand.category, isActive: o.isActive, views: o.viewCount, clicks: o.clickCount, saves: o._count.saves, endDate: o.endDate, createdAt: o.createdAt }));
  return c.json({ analytics }, 200);
});

// ── PATCH /:offerId/status (admin) ────────────────────────────

router.patch('/:offerId/status', authMiddleware, adminCoreAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const offerId = c.req.param('offerId');
  const prisma = c.get('prisma');
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return jsonError(c, requestId, 'Offer not found', 404);
  const updated = await prisma.offer.update({ where: { id: offerId }, data: { isActive: !offer.isActive } });
  return c.json({ msg: `Offer ${updated.isActive ? 'activated' : 'deactivated'}`, offer: updated }, 200);
});

// ── PUT /:offerId (admin) ─────────────────────────────────────

router.put('/:offerId', authMiddleware, adminCoreAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const offerId = c.req.param('offerId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = updateOfferSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'Invalid data', 400);
  const prisma = c.get('prisma');
  const offer = await prisma.offer.findUnique({ where: { id: offerId } });
  if (!offer) return jsonError(c, requestId, 'Offer not found', 404);
  const updateData = Object.fromEntries(Object.entries(parsed.data).map(([k, v]) => [k, v === null ? undefined : v]));
  const updated = await prisma.offer.update({ where: { id: offerId }, data: updateData });
  return c.json({ msg: 'Offer updated', offer: updated }, 200);
});

// ── POST /admin/brand ─────────────────────────────────────────

router.post('/admin/brand', authMiddleware, adminAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = createBrandSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'Invalid brand data', 400);
  const prisma = c.get('prisma');
  const existing = await prisma.brand.findUnique({ where: { name: parsed.data.name } });
  if (existing) return jsonError(c, requestId, 'Brand name already exists', 409);
  const brand = await prisma.brand.create({ data: parsed.data });
  return c.json({ msg: 'Brand created successfully', brand }, 201);
});

// ── POST /admin/offer ─────────────────────────────────────────

router.post('/admin/offer', authMiddleware, adminAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = createOfferSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'Invalid offer data', 400);
  const prisma = c.get('prisma');
  const brand = await prisma.brand.findUnique({ where: { id: parsed.data.brandId } });
  if (!brand) return jsonError(c, requestId, 'Brand ID not found', 404);
  const offer = await prisma.offer.create({ data: parsed.data });
  return c.json({ msg: 'Offer created successfully', offer }, 201);
});

// ── POST /admin/bulk ──────────────────────────────────────────

router.post('/admin/bulk', authMiddleware, adminAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const { items } = body;
  if (!Array.isArray(items) || items.length === 0) return jsonError(c, requestId, 'Items array is required', 400);
  const prisma = c.get('prisma');
  const results = [];
  for (const item of items) {
    const { brand, offer } = item;
    if (!brand?.name || !offer?.title) continue;
    const dbBrand = await prisma.brand.upsert({
      where: { name: brand.name },
      update: { description: brand.description || 'No description provided.', website: brand.website, logo: brand.logo, category: brand.category || 'General', isVerified: brand.isVerified ?? false },
      create: { name: brand.name, description: brand.description || 'No description provided.', website: brand.website, logo: brand.logo, category: brand.category || 'General', isVerified: brand.isVerified ?? false },
    });
    const dbOffer = await prisma.offer.create({
      data: {
        title: offer.title, description: offer.description || 'No description provided.',
        offerType: offer.offerType || 'COUPON', discountValue: offer.discountValue,
        eligibility: offer.eligibility || 'ALL_STUDENTS',
        eligibleColleges: offer.eligibleColleges || [], eligibleBranches: offer.eligibleBranches || [],
        redemptionLink: offer.redemptionLink, termsAndConditions: offer.termsAndConditions,
        endDate: offer.endDate ? new Date(offer.endDate) : null, brandId: dbBrand.id,
      },
    });
    results.push({ brandId: dbBrand.id, offerId: dbOffer.id, title: dbOffer.title });
  }
  return c.json({ msg: `Bulk uploaded ${results.length} offers successfully`, results }, 201);
});

// ── GET /:offerId (public — must be last) ─────────────────────

router.get('/:offerId', async (c) => {
  const requestId = generateRequestId();
  const offerId = c.req.param('offerId');
  const prisma = c.get('prisma');
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { ...offerPublicSelect, termsAndConditions: true, isActive: true },
  });
  if (!offer) return jsonError(c, requestId, 'Offer not found', 404);
  const now = new Date();
  if (!offer.isActive || (offer.startDate && offer.startDate > now) || (offer.endDate && offer.endDate < now)) {
    return jsonError(c, requestId, 'Offer not found', 404);
  }
  return c.json({ offer }, 200);
});

export default router;
