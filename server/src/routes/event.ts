import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { EventController } from '../controllers/EventController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router();
const eventController = container.get<EventController>(TYPES.EventController);

router.get('/', (req, res, next) => eventController.getEvents(req, res, next));
router.get('/id/:eventId', (req, res, next) => eventController.getEventById(req, res, next));
router.get('/name/:eventName', (req, res, next) => eventController.getEventByName(req, res, next));
router.get('/owner/:ownerId', (req, res, next) => eventController.getEventsByOwner(req, res, next));
router.post('/', (req, res, next) => eventController.createEvent(req, res, next));
router.post('/batch', (req, res, next) => eventController.batchCreateEvents(req, res, next));
router.put('/:eventId', (req, res, next) => eventController.updateEvent(req, res, next));
router.delete('/', (req, res, next) => eventController.deleteEvent(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => eventController.batchDeleteEvents(req, res, next));

export default router;