import express from 'express';
import { container } from '../configs/inversify.config';
import { TYPES } from '../configs/types';
import { SurveyController } from '../controllers/SurveyController';
import authorizeRoles from '../util/auth/authorizeRoles';
import { Roles } from '../models/Roles';

const router = express.Router({ mergeParams: true });
const surveyController = container.get<SurveyController>(TYPES.SurveyController);

// Admin routes
router.get('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => surveyController.getSurveys(req, res, next));
router.get('/id/:surveyId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => surveyController.getSurveybyId(req, res, next));
router.post('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => surveyController.saveSurvey(req, res, next));
router.delete('/', authorizeRoles([Roles.EDITOR, Roles.ADMIN]), (req, res, next) => surveyController.deleteSurvey(req, res, next));
// Survey response routes
router.get('/published', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.GUEST]), (req, res, next) => surveyController.getPublishedSurveys(req, res, next));
router.get('/response/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.GUEST]), (req, res, next) => surveyController.getAllSurveyResponsesForGuest(req, res, next));
router.get('/:surveyId/response', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY]), (req, res, next) => surveyController.getSurveyResponses(req, res, next));
router.get('/:surveyId/response/id/:surveyResponseId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.GUEST]), (req, res, next) => surveyController.getSurveyResponseById(req, res, next));
router.get('/:surveyId/response/guest/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.READONLY, Roles.GUEST]), (req, res, next) => surveyController.getSurveyResponseByGuest(req, res, next));
router.get('/:surveyId/response/party/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.GUEST]), (req, res, next) => surveyController.fetchPartySurveyResponses(req, res, next));
router.post('/:surveyId/response', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.GUEST]), (req, res, next) => surveyController.saveSurveyResponse(req, res, next));
router.put('/:surveyId/response/party/:guestId', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.GUEST]), (req, res, next) => surveyController.initializeSurveysForParty(req, res, next));
router.delete('/:surveyId/response', authorizeRoles([Roles.EDITOR, Roles.ADMIN, Roles.GUEST]), (req, res, next) => surveyController.deleteSurveyResponse(req, res, next));

export default router;