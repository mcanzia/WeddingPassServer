import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { HotelController } from '../controllers/HotelController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const hotelController = container.get<HotelController>(TYPES.HotelController);

router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => hotelController.getHotels(req, res, next));
router.get('/id/:hotelId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => hotelController.getHotelbyId(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => hotelController.saveHotel(req, res, next));
router.post('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => hotelController.batchCreateHotels(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => hotelController.deleteHotel(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => hotelController.batchDeleteHotels(req, res, next));

export default router;