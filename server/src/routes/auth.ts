import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { AuthController } from '../controllers/AuthController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const authController = container.get<AuthController>(TYPES.AuthController);

router.get('/roles/:userId', (req, res, next) => authController.getUserRoles(req, res, next));
router.get('/', (req, res, next) => authController.getUsers(req, res, next));
router.get('/id/:userId', (req, res, next) => authController.getUserById(req, res, next));
router.get('/phone/:userPhone', (req, res, next) => authController.getUserByPhone(req, res, next));
router.get('/email/:userEmail', (req, res, next) => authController.getUserByEmail(req, res, next));
router.post('/', (req, res, next) => authController.createUser(req, res, next));
router.post('/:eventId/invite', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => authController.generateInviteLink(req, res, next));
router.post('/process-invite', (req, res, next) => authController.processInvite(req, res, next));
router.post('/roles', (req, res, next) => authController.addUserToEvent(req, res, next));
router.put('/:userId', (req, res, next) => authController.updateUser(req, res, next));
router.delete('/', (req, res, next) => authController.deleteUser(req, res, next));

export default router;