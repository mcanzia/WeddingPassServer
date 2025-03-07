import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { AccommodationController } from '../controllers/AccommodationController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const accommodationController = container.get<AccommodationController>(TYPES.AccommodationController);

router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => accommodationController.getAccommodations(req, res, next));
router.get('/id/:accommodationId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => accommodationController.getAccommodationbyId(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => accommodationController.saveAccommodation(req, res, next));
router.post('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => accommodationController.batchCreateAccommodations(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => accommodationController.deleteAccommodation(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => accommodationController.batchDeleteAccommodations(req, res, next));

export default router;