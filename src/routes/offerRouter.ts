import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AdminCoreAuthMiddleware } from '../middleware/AdminCoreAuthMiddleware';
import {
  getAllOffers,
  getOfferById,
  searchOffers,
  getBrandOffers,
  claimOffer,
  redeemOffer,
  saveOffer,
  getSavedOffers,
  trackView,
  trackClick,
  toggleOfferStatus,
  updateOffer,
  getOfferAnalytics,
} from '../controller/offer.controller';

const router = Router();

// ── Public (student-facing) ──────────────────────────────────
router.get('/all', getAllOffers);
router.get('/search', searchOffers);
router.get('/brand/:brandId', getBrandOffers);

// ── Authenticated (student actions) ──────────────────────────
router.get('/saved/me', AuthMiddleware, getSavedOffers);
router.post('/:offerId/claim', AuthMiddleware, claimOffer);
router.post('/:offerId/redeem', AuthMiddleware, redeemOffer);
router.post('/:offerId/save', AuthMiddleware, saveOffer);

// ── Analytics (fire-and-forget) ──────────────────────────────
router.post('/:offerId/view', trackView);
router.post('/:offerId/click', trackClick);

// ── Admin ────────────────────────────────────────────────────
router.get('/analytics/all', AuthMiddleware, AdminCoreAuthMiddleware, getOfferAnalytics);
router.patch('/:offerId/status', AuthMiddleware, AdminCoreAuthMiddleware, toggleOfferStatus);
router.put('/:offerId', AuthMiddleware, AdminCoreAuthMiddleware, updateOffer);

// ── Public (by ID — placed last to avoid catching other routes) ──
router.get('/:offerId', getOfferById);

export const offerRouter = router;
