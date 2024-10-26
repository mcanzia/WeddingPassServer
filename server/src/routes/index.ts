import express from 'express';
import passRoutes from './pass';
import guestRoutes from './guest';
import eventRoutes from './event';
import weddingRoutes from './wedding';
import authRoutes from './auth';

const router = express.Router();

router.use(express.json());

router.use('/pass', passRoutes);
router.use('/guests', guestRoutes);
router.use('/events', eventRoutes);
router.use('/weddings', weddingRoutes);
router.use('/auth', authRoutes);
export default router;


