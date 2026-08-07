import { Router } from 'express';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { AdminCoreAuthMiddleware } from '../middleware/AdminCoreAuthMiddleware';
import { AdminAuthMiddleware } from '../middleware/AdminAuthMiddleware';
import {
  getAllOffers,
  getOfferById,
  searchOffers,
  getBrandOffers,
  saveOffer,
  getSavedOffers,
  trackView,
  trackClick,
  toggleOfferStatus,
  updateOffer,
  getOfferAnalytics,
  adminCreateBrand,
  adminCreateOffer,
  adminBulkUploadOffers,
} from '../controller/offer.controller';

const router = Router();

// ── Public (student-facing) ──────────────────────────────────
router.get('/all', getAllOffers);
router.get('/search', searchOffers);
router.get('/brand/:brandId', getBrandOffers);

// ── Authenticated (student actions) ──────────────────────────
router.get('/saved/me', AuthMiddleware, getSavedOffers);
router.post('/:offerId/save', AuthMiddleware, saveOffer);

// ── Analytics (fire-and-forget) ──────────────────────────────
router.post('/:offerId/view', trackView);
router.post('/:offerId/click', trackClick);

// ── Admin Management (Event specific - requires core status) ─────
router.get('/analytics/all', AuthMiddleware, AdminCoreAuthMiddleware, getOfferAnalytics);
router.patch('/:offerId/status', AuthMiddleware, AdminCoreAuthMiddleware, toggleOfferStatus);
router.put('/:offerId', AuthMiddleware, AdminCoreAuthMiddleware, updateOffer);

// ── Admin Creation / Upload (Global site admin status required) ──
router.post('/admin/brand', AuthMiddleware, AdminAuthMiddleware, adminCreateBrand);
router.post('/admin/offer', AuthMiddleware, AdminAuthMiddleware, adminCreateOffer);
router.post('/admin/bulk', AuthMiddleware, AdminAuthMiddleware, adminBulkUploadOffers);

// ── Public (by ID — placed last to avoid catching other routes) ──
router.get('/:offerId', getOfferById);

export const offerRouter = router;
