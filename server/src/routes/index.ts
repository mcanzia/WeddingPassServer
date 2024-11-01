import express from 'express';
import passRoutes from './pass';
import guestRoutes from './guest';
import eventRoutes from './event';
import weddingRoutes from './wedding';
import authRoutes from './auth';

const router = express.Router({ mergeParams: true });

router.use(express.json());

router.use('/pass', passRoutes);
router.use('/weddings/:weddingId/guests', guestRoutes);
router.use('/weddings/:weddingId/events', eventRoutes);
router.use('/weddings', weddingRoutes);
router.use('/auth', authRoutes);
export default router;


