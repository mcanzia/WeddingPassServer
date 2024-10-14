import express from 'express';
import passRoutes from './pass';
import guestRoutes from './guest';
import eventRoutes from './event';

const router = express.Router();

router.use(express.json());

router.use('/pass', passRoutes);
router.use('/guests', guestRoutes);
router.use('/events', eventRoutes);
export default router;


