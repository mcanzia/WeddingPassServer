import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { SubEventController } from '../controllers/SubEventController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const subEventController = container.get<SubEventController>(TYPES.SubEventController);

router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => subEventController.getSubEvents(req, res, next));
router.get('/id/:subEventId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => subEventController.getSubEventbyId(req, res, next));
router.get('/name/:subEventName', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.TRIO]), (req, res, next) => subEventController.getSubEventbyName(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.TRIO]), (req, res, next) => subEventController.createSubEvent(req, res, next));
router.post('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.TRIO]), (req, res, next) => subEventController.batchCreateSubEvents(req, res, next));
router.put('/:subEventId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.TRIO]), (req, res, next) => subEventController.updateSubEvent(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => subEventController.deleteSubEvent(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => subEventController.batchDeleteSubEvents(req, res, next));

export default router;