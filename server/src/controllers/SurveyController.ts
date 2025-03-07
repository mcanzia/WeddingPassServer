import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Survey } from "../models/Survey";
import { CustomError } from '../util/error/CustomError';
import { SurveyDao } from '../dao/SurveyDao';
import { TYPES } from '../configs/types';
import { SurveyResponse } from '../models/SurveyResponse';
import { SurveyService } from '../services/SurveyService';

@injectable()
export class SurveyController {

    constructor(@inject(TYPES.SurveyDao) private surveyDao: SurveyDao, @inject(TYPES.SurveyService) private surveyService: SurveyService) { }

    async getSurveys(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all surveys`);
            const { eventId } = request.params;

            const surveys: Array<Survey> = await this.surveyDao.getAllSurveys(eventId);

            Logger.info(`Number of surveys retrieved successfully: ${surveys.length}`);
            response.status(200).json(surveys);
        } catch (error) {
            Logger.error("Error retrieving surveys");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getPublishedSurveys(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving published surveys`);
            const { eventId } = request.params;

            const surveys: Array<Survey> = await this.surveyDao.getPublishedSurveys(eventId);

            Logger.info(`Number of surveys retrieved successfully: ${surveys.length}`);
            response.status(200).json(surveys);
        } catch (error) {
            Logger.error("Error retrieving published surveys");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSurveybyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving survey with ID: ${request.params.surveyId}`);
            const { eventId, surveyId } = request.params;
            const survey: Survey = await this.surveyDao.getSurveyById(eventId, surveyId);
            response.status(200).json(survey);
        } catch (error) {
            Logger.error(`Error retrieving survey with ${request.params.surveyId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveSurvey(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new survey`);
            const { eventId } = request.params;
            const survey: Survey = request.body;
            const updatedSurvey: Survey = await this.surveyDao.saveSurvey(eventId, survey);
            Logger.info(`Successfully updated survey for ${survey.title}`);
            response.status(200).json(updatedSurvey);
        } catch (error) {
            Logger.error("Error updated survey", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteSurvey(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting survey ${JSON.stringify(request.body)}`);
            const { eventId } = request.params;
            const survey: Survey = request.body;
            await this.surveyDao.deleteSurvey(eventId, survey.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting survey", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    // Survey Responses
    async getSurveyResponses(request: Request, response: Response, next: NextFunction) {
        try {
            const { eventId, surveyId } = request.params;

            Logger.info(`Retrieving all survey responses for ${surveyId}`);

            const surveyResponses: Array<SurveyResponse> = await this.surveyDao.getAllSurveyResponses(eventId, surveyId);

            Logger.info(`Number of survey responses retrieved successfully: ${surveyResponses.length}`);
            response.status(200).json(surveyResponses);
        } catch (error) {
            Logger.error("Error retrieving survey responses");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getAllSurveyResponsesForGuest(request: Request, response: Response, next: NextFunction) {
        try {
            const { eventId, guestId } = request.params;

            Logger.info(`Retrieving all survey responses for guest ${guestId}`);

            const surveyResponses: Array<SurveyResponse> = await this.surveyDao.getAllSurveyResponsesForGuest(eventId, guestId);

            Logger.info(`Number of survey responses retrieved successfully: ${surveyResponses.length}`);
            response.status(200).json(surveyResponses);
        } catch (error) {
            Logger.error(`Error retrieving survey responses for guest ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSurveyResponseById(request: Request, response: Response, next: NextFunction) {
        try {
            const { eventId, surveyId, surveyResponseId } = request.params;
            Logger.info(`Retrieving survey response with ID: ${surveyResponseId}`);
            const surveyResponse: SurveyResponse = await this.surveyDao.getSurveyResponseById(eventId, surveyId, surveyResponseId);
            response.status(200).json(surveyResponse);
        } catch (error) {
            Logger.error(`Error retrieving survey response with ${request.params.surveyResponseId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSurveyResponseByGuest(request: Request, response: Response, next: NextFunction) {
        try {
            const { eventId, surveyId, guestId } = request.params;
            Logger.info(`Retrieving survey response with guestId: ${guestId}`);
            const surveyResponse: SurveyResponse = await this.surveyDao.getSurveyResponseByGuest(eventId, surveyId, guestId);
            response.status(200).json(surveyResponse);
        } catch (error) {
            Logger.error(`Error retrieving survey response with guestId ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveSurveyResponse(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new survey response`);
            const { eventId, surveyId } = request.params;
            const surveyResponse: SurveyResponse = request.body;
            const updatedSurveyResponse: SurveyResponse = await this.surveyDao.saveSurveyResponse(eventId, surveyId, surveyResponse);
            Logger.info(`Successfully updated survey response for survey ${surveyId} and guest ${surveyResponse.guest.name}`);
            response.status(200).json(updatedSurveyResponse);
        } catch (error) {
            Logger.error("Error updated survey response", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async initializeSurveysForParty(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Initializing surveys for party with ${request.params.guestId}`);
            const { eventId, surveyId, guestId } = request.params;
            const survey: Survey = request.body;
            const partySurveyResponses: SurveyResponse[] = await this.surveyService.initializeSurveysForParty(eventId, guestId, survey);
            Logger.info(`Successfully added survey responses for survey ${surveyId} and party with guest ${guestId}`);
            response.status(200).json(partySurveyResponses);
        } catch (error) {
            Logger.error("Error updated survey response", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async fetchPartySurveyResponses(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving party survey responses`);
            const { eventId, surveyId, guestId } = request.params;

            const surveyResponses: Array<SurveyResponse> = await this.surveyDao.fetchPartySurveyResponses(eventId, surveyId, guestId);

            Logger.info(`Number of survey responses retrieved successfully: ${surveyResponses.length}`);
            response.status(200).json(surveyResponses);
        } catch (error) {
            Logger.error("Error retrieving party survey responses");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteSurveyResponse(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting survey response ${JSON.stringify(request.body)}`);
            const { eventId, surveyId } = request.params;
            const surveyResponse: SurveyResponse = request.body;
            await this.surveyDao.deleteSurveyResponse(eventId, surveyId, surveyResponse.responseId);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting survey response", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}