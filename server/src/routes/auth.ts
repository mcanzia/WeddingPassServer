import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { AuthController } from '../controllers/AuthController';

const router = express.Router();
const authController = container.get<AuthController>(TYPES.AuthController);

router.put('/roles/:userId', (req, res, next) => authController.setUserRole(req, res, next));
router.get('/roles/:userId', (req, res, next) => authController.getUserRoles(req, res, next));
router.get('/', (req, res, next) => authController.getUsers(req, res, next));
router.get('/:userId', (req, res, next) => authController.getUserById(req, res, next));
router.post('/', (req, res, next) => authController.createUser(req, res, next));
router.put('/:userId', (req, res, next) => authController.updateUser(req, res, next));
router.delete('/', (req, res, next) => authController.deleteUser(req, res, next));

export default router;