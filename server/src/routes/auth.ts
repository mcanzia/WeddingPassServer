import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.put('/:userId', (req, res, next) => authController.setUserRole(req, res, next));
router.get('/:userId', (req, res, next) => authController.getUserRoles(req, res, next));

export default router;