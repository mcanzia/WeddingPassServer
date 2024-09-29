import express from 'express';
import passRoutes from './pass';
import guestRoutes from './guest';
const router = express.Router();

router.use(express.json());

router.use('/pass', passRoutes);
router.use('/guest', guestRoutes);
export default router;


