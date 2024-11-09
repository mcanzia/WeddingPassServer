import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { SurveyController } from '../controllers/SurveyController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const surveyController = container.get<SurveyController>(TYPES.SurveyController);

router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => surveyController.getSurveys(req, res, next));
router.get('/id/:surveyId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => surveyController.getSurveybyId(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => surveyController.createSurvey(req, res, next));
router.put('/:surveyId', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => surveyController.updateSurvey(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => surveyController.deleteSurvey(req, res, next));

export default router;