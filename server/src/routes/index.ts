import express from 'express';
import passRoutes from './pass';
import guestRoutes from './guest';
import subEventRoutes from './subevent';
import surveyRoutes from './survey';
import eventRoutes from './event';
import authRoutes from './auth';
import pendingGuestRoutes from './pending-guest';
import accommodationRoutes from './accommodation';

const router = express.Router({ mergeParams: true });

router.use(express.json());

router.use('/pass', passRoutes);
router.use('/events/:eventId/guests', guestRoutes);
router.use('/events/:eventId/subevents', subEventRoutes);
router.use('/events/:eventId/surveys', surveyRoutes);
router.use('/events/:eventId/pending-guests', pendingGuestRoutes);
router.use('/events/:eventId/accommodations', accommodationRoutes);
router.use('/events', eventRoutes);
router.use('/users', authRoutes);
export default router;


