import { Request, Response } from 'express';
import { prisma } from '../db/db';
import { offerQuerySchema, updateOfferSchema } from '../utils/offer.validation';

// ── PUBLIC: Get all active offers (paginated, filtered) ─────

export const getAllOffers = async (req: Request, res: Response) => {
  try {
    const parsed = offerQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ msg: 'Invalid query params', errors: parsed.error.flatten() });
      return;
    }

    const { page, limit, category, offerType, eligibility } = parsed.data;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    // Only show offers that haven't expired
    where.OR = [
      { endDate: null },
      { endDate: { gte: new Date() } },
    ];

    if (offerType) where.offerType = offerType;
    if (eligibility) where.eligibility = eligibility;
    if (category) {
      where.brand = { category: { equals: category, mode: 'insensitive' } };
    }

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          offerType: true,
          discountValue: true,
          eligibility: true,
          eligibleColleges: true,
          eligibleBranches: true,
          redemptionLink: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          // couponCode intentionally excluded
          brand: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              website: true,
              category: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.offer.count({ where }),
    ]);

    res.status(200).json({
      offers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getAllOffers error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── PUBLIC: Get single offer by ID ──────────────────────────

export const getOfferById = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.offerId as string;

    const offer = await prisma.offer.findUnique({
      where: { id: offerId },
      select: {
        id: true,
        title: true,
        description: true,
        offerType: true,
        discountValue: true,
        eligibility: true,
        eligibleColleges: true,
        eligibleBranches: true,
        redemptionLink: true,
        termsAndConditions: true,
        startDate: true,
        endDate: true,
        isActive: true,
        createdAt: true,
        brand: {
          select: {
            id: true,
            name: true,
            logo: true,
            description: true,
            website: true,
            category: true,
            isVerified: true,
          },
        },
      },
    });

    if (!offer) {
      res.status(404).json({ msg: 'Offer not found' });
      return;
    }

    res.status(200).json({ offer });
  } catch (error) {
    console.error('getOfferById error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── PUBLIC: Search offers ───────────────────────────────────

export const searchOffers = async (req: Request, res: Response) => {
  try {
    const parsed = offerQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      res.status(400).json({ msg: 'Invalid query params', errors: parsed.error.flatten() });
      return;
    }

    const { page, limit, search } = parsed.data;
    if (!search || search.trim().length === 0) {
      res.status(400).json({ msg: 'Search query is required' });
      return;
    }

    const skip = (page - 1) * limit;
    const searchTerm = search.trim();

    const where: any = {
      isActive: true,
      OR: [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
        { brand: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ],
    };

    const [offers, total] = await Promise.all([
      prisma.offer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          offerType: true,
          discountValue: true,
          eligibility: true,
          redemptionLink: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          brand: {
            select: {
              id: true,
              name: true,
              logo: true,
              description: true,
              category: true,
              isVerified: true,
            },
          },
        },
      }),
      prisma.offer.count({ where }),
    ]);

    res.status(200).json({
      offers,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('searchOffers error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── PUBLIC: Get all offers for a brand ──────────────────────

export const getBrandOffers = async (req: Request, res: Response) => {
  try {
    const brandId = req.params.brandId as string;

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      select: {
        id: true,
        name: true,
        logo: true,
        description: true,
        website: true,
        category: true,
        isVerified: true,
        offers: {
          where: {
            isActive: true,
            OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
          },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            description: true,
            offerType: true,
            discountValue: true,
            eligibility: true,
            redemptionLink: true,
            startDate: true,
            endDate: true,
            createdAt: true,
          },
        },
      },
    });

    if (!brand) {
      res.status(404).json({ msg: 'Brand not found' });
      return;
    }

    res.status(200).json({ brand });
  } catch (error) {
    console.error('getBrandOffers error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── AUTH: Save/unsave an offer (toggle) ─────────────────────

export const saveOffer = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.offerId as string;
    const userId = req.id as string;

    const existing = await prisma.offerSave.findUnique({
      where: { offerId_userId: { offerId, userId } },
    });

    if (existing) {
      await prisma.offerSave.delete({ where: { id: existing.id } });
      res.status(200).json({ msg: 'Offer unsaved', saved: false });
      return;
    }

    await prisma.offerSave.create({ data: { offerId, userId } });
    res.status(201).json({ msg: 'Offer saved', saved: true });
  } catch (error) {
    console.error('saveOffer error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── AUTH: Get saved offers ──────────────────────────────────

export const getSavedOffers = async (req: Request, res: Response) => {
  try {
    const userId = req.id as string;

    const saves = await prisma.offerSave.findMany({
      where: { userId },
      orderBy: { savedAt: 'desc' },
      select: {
        id: true,
        savedAt: true,
        offer: {
          select: {
            id: true,
            title: true,
            description: true,
            offerType: true,
            discountValue: true,
            startDate: true,
            endDate: true,
            isActive: true,
            brand: {
              select: {
                id: true,
                name: true,
                logo: true,
                category: true,
                isVerified: true,
              },
            },
          },
        },
      },
    });

    res.status(200).json({ savedOffers: saves });
  } catch (error) {
    console.error('getSavedOffers error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── PUBLIC: Track view (fire-and-forget) ────────────────────

export const trackView = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.offerId as string;

    await prisma.offer.update({
      where: { id: offerId },
      data: { viewCount: { increment: 1 } },
    });

    res.status(200).json({ msg: 'View tracked' });
  } catch (error) {
    res.status(200).json({ msg: 'ok' });
  }
};

// ── PUBLIC: Track click (fire-and-forget) ───────────────────

export const trackClick = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.offerId as string;

    await prisma.offer.update({
      where: { id: offerId },
      data: { clickCount: { increment: 1 } },
    });

    res.status(200).json({ msg: 'Click tracked' });
  } catch (error) {
    res.status(200).json({ msg: 'ok' });
  }
};

// ── ADMIN: Toggle offer active status ───────────────────────

export const toggleOfferStatus = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.offerId as string;

    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
      res.status(404).json({ msg: 'Offer not found' });
      return;
    }

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: { isActive: !offer.isActive },
    });

    res.status(200).json({
      msg: `Offer ${updated.isActive ? 'activated' : 'deactivated'}`,
      offer: updated,
    });
  } catch (error) {
    console.error('toggleOfferStatus error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── ADMIN: Update offer details ─────────────────────────────

export const updateOffer = async (req: Request, res: Response) => {
  try {
    const offerId = req.params.offerId as string;

    const parsed = updateOfferSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ msg: 'Invalid data', errors: parsed.error.flatten() });
      return;
    }

    const offer = await prisma.offer.findUnique({ where: { id: offerId } });
    if (!offer) {
      res.status(404).json({ msg: 'Offer not found' });
      return;
    }

    const updated = await prisma.offer.update({
      where: { id: offerId },
      data: parsed.data,
    });

    res.status(200).json({ msg: 'Offer updated', offer: updated });
  } catch (error) {
    console.error('updateOffer error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── ADMIN: Get analytics for all offers ─────────────────────

export const getOfferAnalytics = async (req: Request, res: Response) => {
  try {
    const offers = await prisma.offer.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        isActive: true,
        viewCount: true,
        clickCount: true,
        createdAt: true,
        endDate: true,
        brand: {
          select: {
            name: true,
            category: true,
          },
        },
        _count: {
          select: {
            saves: true,
          },
        },
      },
    });

    const analytics = offers.map((offer) => ({
      id: offer.id,
      title: offer.title,
      brand: offer.brand.name,
      category: offer.brand.category,
      isActive: offer.isActive,
      views: offer.viewCount,
      clicks: offer.clickCount,
      saves: offer._count.saves,
      endDate: offer.endDate,
      createdAt: offer.createdAt,
    }));

    res.status(200).json({ analytics });
  } catch (error) {
    console.error('getOfferAnalytics error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── ADMIN: Create brand profile ─────────────────────────────

export const adminCreateBrand = async (req: Request, res: Response) => {
  try {
    const parsed = require('../utils/offer.validation').createBrandSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ msg: 'Invalid brand data', errors: parsed.error.flatten() });
      return;
    }

    const existing = await prisma.brand.findUnique({ where: { name: parsed.data.name } });
    if (existing) {
      res.status(409).json({ msg: 'Brand name already exists' });
      return;
    }

    const brand = await prisma.brand.create({ data: parsed.data });
    res.status(201).json({ msg: 'Brand created successfully', brand });
  } catch (error) {
    console.error('adminCreateBrand error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── ADMIN: Create a single offer ────────────────────────────

export const adminCreateOffer = async (req: Request, res: Response) => {
  try {
    const parsed = require('../utils/offer.validation').createOfferSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ msg: 'Invalid offer data', errors: parsed.error.flatten() });
      return;
    }

    const brand = await prisma.brand.findUnique({ where: { id: parsed.data.brandId } });
    if (!brand) {
      res.status(404).json({ msg: 'Brand ID not found' });
      return;
    }

    const offer = await prisma.offer.create({ data: parsed.data });
    res.status(201).json({ msg: 'Offer created successfully', offer });
  } catch (error) {
    console.error('adminCreateOffer error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ── ADMIN: Bulk upload/seed offers & brands ─────────────────

export const adminBulkUploadOffers = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      res.status(400).json({ msg: 'Items array is required' });
      return;
    }

    const results = [];

    for (const item of items) {
      const { brand, offer } = item;

      if (!brand || !brand.name || !offer || !offer.title) {
        continue;
      }

      // Upsert brand
      const dbBrand = await prisma.brand.upsert({
        where: { name: brand.name },
        update: {
          description: brand.description || 'No description provided.',
          website: brand.website,
          logo: brand.logo,
          category: brand.category || 'General',
          isVerified: brand.isVerified ?? false,
        },
        create: {
          name: brand.name,
          description: brand.description || 'No description provided.',
          website: brand.website,
          logo: brand.logo,
          category: brand.category || 'General',
          isVerified: brand.isVerified ?? false,
        },
      });

      // Create offer
      const dbOffer = await prisma.offer.create({
        data: {
          title: offer.title,
          description: offer.description || 'No description provided.',
          offerType: offer.offerType || 'COUPON',
          discountValue: offer.discountValue,
          eligibility: offer.eligibility || 'ALL_STUDENTS',
          eligibleColleges: offer.eligibleColleges || [],
          eligibleBranches: offer.eligibleBranches || [],
          redemptionLink: offer.redemptionLink,
          termsAndConditions: offer.termsAndConditions,
          endDate: offer.endDate ? new Date(offer.endDate) : null,
          brandId: dbBrand.id,
        },
      });

      results.push({ brandId: dbBrand.id, offerId: dbOffer.id, title: dbOffer.title });
    }

    res.status(201).json({ msg: `Bulk uploaded ${results.length} offers successfully`, results });
  } catch (error) {
    console.error('adminBulkUploadOffers error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};
