import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { WeddingController } from '../controllers/WeddingController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router();
const weddingController = container.get<WeddingController>(TYPES.WeddingController);

router.get('/', (req, res, next) => weddingController.getWeddings(req, res, next));
router.get('/id/:weddingId', (req, res, next) => weddingController.getWeddingById(req, res, next));
router.get('/name/:weddingName', (req, res, next) => weddingController.getWeddingByName(req, res, next));
router.get('/owner/:ownerId', (req, res, next) => weddingController.getWeddingsByOwner(req, res, next));
router.post('/', (req, res, next) => weddingController.createWedding(req, res, next));
router.post('/batch', (req, res, next) => weddingController.batchCreateWeddings(req, res, next));
router.put('/:weddingId', (req, res, next) => weddingController.updateWedding(req, res, next));
router.delete('/', (req, res, next) => weddingController.deleteWedding(req, res, next));
router.delete('/batch', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => weddingController.batchDeleteWeddings(req, res, next));

export default router;