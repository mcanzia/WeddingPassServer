import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { GuestController } from '../controllers/GuestController';
import upload from '../util/upload/upload';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router();
const guestController = container.get<GuestController>(TYPES.GuestController);

router.get('/', (req, res, next) => guestController.getGuests(req, res, next));
router.get('/id/:guestId', (req, res, next) => guestController.getGuestbyId(req, res, next));
router.get('/name/:guestName', authorizeRoles([Roles.READONLY, Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.getGuestbyName(req, res, next));
router.get('/:serialNumber', authorizeRoles([Roles.READONLY, Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.getGuestbySerialNumber(req, res, next));
router.get('/event/:eventId', authorizeRoles([Roles.READONLY, Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.getGuestsForEvent(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.createGuest(req, res, next));
router.post('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.batchCreateGuests(req, res, next));
router.post('/upload', authorizeRoles([Roles.ADMIN]), upload.single('file'), (req, res, next) => guestController.uploadGuests(req, res, next));
router.put('/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.updateGuest(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.deleteGuest(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.batchDeleteGuests(req, res, next));

export default router;