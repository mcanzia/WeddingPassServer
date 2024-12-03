import express from 'express';
import passRoutes from './pass';
import guestRoutes from './guest';
import eventRoutes from './event';
import surveyRoutes from './survey';
import weddingRoutes from './wedding';
import authRoutes from './auth';
import pendingGuestRoutes from './pending-guest';

const router = express.Router({ mergeParams: true });

router.use(express.json());

router.use('/pass', passRoutes);
router.use('/weddings/:weddingId/guests', guestRoutes);
router.use('/weddings/:weddingId/events', eventRoutes);
router.use('/weddings/:weddingId/surveys', surveyRoutes);
router.use('/weddings/:weddingId/pending-guests', pendingGuestRoutes);
router.use('/weddings', weddingRoutes);
router.use('/auth', authRoutes);
export default router;


