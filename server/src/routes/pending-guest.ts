import { container } from '../configs/inversify.config';
import express from 'express';
import { PendingGuestController } from '../controllers/PendingGuestController';
import { TYPES } from '../configs/types';
import { Roles } from '../models/Roles';
import authorizeRoles from '../util/auth/authorizeRoles';

const router = express.Router({ mergeParams: true });
const pendingGuestController = container.get<PendingGuestController>(TYPES.PendingGuestController);

router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => pendingGuestController.getPendingGuests(req, res, next));
router.get('/id/:pendingGuestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => pendingGuestController.getPendingGuestbyId(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.GUEST]), (req, res, next) => pendingGuestController.savePendingGuest(req, res, next));
router.post('/link', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => pendingGuestController.linkGuestAccount(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => pendingGuestController.deletePendingGuest(req, res, next));

export default router;