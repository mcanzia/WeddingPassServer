import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { GuestController } from '../controllers/GuestController';
import upload from '../util/upload/upload';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const guestController = container.get<GuestController>(TYPES.GuestController);

router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => guestController.getGuests(req, res, next));
router.get('/party/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO, Roles.GUEST]), (req, res, next) => guestController.fetchPartyMembers(req, res, next));
router.get('/id/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.GUEST, Roles.TRIO]), (req, res, next) => guestController.getGuestbyId(req, res, next));
router.get('/name/:guestName', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => guestController.getGuestbyName(req, res, next));
router.get('/phone/:guestPhone', (req, res, next) => guestController.getGuestsByPhone(req, res, next));
router.get('/email/:guestEmail', (req, res, next) => guestController.getGuestsbyEmail(req, res, next));
router.get('/serial/:serialNumber', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => guestController.getGuestbySerialNumber(req, res, next));
router.get('/event/:eventId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => guestController.getGuestsForEvent(req, res, next));
router.get('/hotel/:hotelId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => guestController.getGuestsByHotel(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.GUEST, Roles.TRIO]), (req, res, next) => guestController.saveGuest(req, res, next));
router.post('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.batchCreateGuests(req, res, next));
router.post('/upload', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), upload.single('file'), (req, res, next) => guestController.uploadGuests(req, res, next));
router.get('/download', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.downloadGuests(req, res, next));
router.put('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.batchUpdateGuests(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.deleteGuest(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => guestController.batchDeleteGuests(req, res, next));

export default router;