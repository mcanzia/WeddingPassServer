import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { PassController } from '../controllers/PassController';

const router = express.Router({ mergeParams: true });
const passController = container.get<PassController>(TYPES.PassController);

router.get('/', (req, res, next) => passController.getPasses(req, res, next));
router.get('/id/:passId', (req, res, next) => passController.getPassbyId(req, res, next));
router.get('/name/:passName', (req, res, next) => passController.getPassbyName(req, res, next));
router.get('/:serialNumber', (req, res, next) => passController.generateNewPass(req, res, next));
router.post('/', (req, res, next) => passController.createPass(req, res, next));
router.put('/:passId', (req, res, next) => passController.updatePass(req, res, next));
router.delete('/', (req, res, next) => passController.deletePass(req, res, next));

export default router;