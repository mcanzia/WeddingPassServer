import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Survey } from "../models/Survey";
import { CustomError } from '../util/error/CustomError';
import { SurveyDao } from '../dao/SurveyDao';
import { TYPES } from '../configs/types';
import { SurveyResponse } from '../models/SurveyResponse';

@injectable()
export class SurveyController {

    constructor(@inject(TYPES.SurveyDao) private surveyDao: SurveyDao) { }

    async getSurveys(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all surveys`);
            const { weddingId } = request.params;

            const surveys: Array<Survey> = await this.surveyDao.getAllSurveys(weddingId);

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
            const { weddingId } = request.params;

            const surveys: Array<Survey> = await this.surveyDao.getPublishedSurveys(weddingId);

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
            const { weddingId, surveyId } = request.params;
            const survey: Survey = await this.surveyDao.getSurveyById(weddingId, surveyId);
            response.status(200).json(survey);
        } catch (error) {
            Logger.error(`Error retrieving survey with ${request.params.surveyId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveSurvey(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new survey`);
            const { weddingId } = request.params;
            const survey: Survey = request.body;
            const updatedSurvey: Survey = await this.surveyDao.saveSurvey(weddingId, survey);
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
            const { weddingId } = request.params;
            const survey: Survey = request.body;
            await this.surveyDao.deleteSurvey(weddingId, survey.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting survey", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    // Survey Responses
    async getSurveyResponses(request: Request, response: Response, next: NextFunction) {
        try {
            const { weddingId, surveyId } = request.params;

            Logger.info(`Retrieving all survey responses for ${surveyId}`);

            const surveyResponses: Array<SurveyResponse> = await this.surveyDao.getAllSurveyResponses(weddingId, surveyId);

            Logger.info(`Number of survey responses retrieved successfully: ${surveyResponses.length}`);
            response.status(200).json(surveyResponses);
        } catch (error) {
            Logger.error("Error retrieving survey responses");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getAllSurveyResponsesForGuest(request: Request, response: Response, next: NextFunction) {
        try {
            const { weddingId, guestId } = request.params;

            Logger.info(`Retrieving all survey responses for guest ${guestId}`);

            const surveyResponses: Array<SurveyResponse> = await this.surveyDao.getAllSurveyResponsesForGuest(weddingId, guestId);

            Logger.info(`Number of survey responses retrieved successfully: ${surveyResponses.length}`);
            response.status(200).json(surveyResponses);
        } catch (error) {
            Logger.error(`Error retrieving survey responses for guest ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSurveyResponseById(request: Request, response: Response, next: NextFunction) {
        try {
            const { weddingId, surveyId, surveyResponseId } = request.params;
            Logger.info(`Retrieving survey response with ID: ${surveyResponseId}`);
            const surveyResponse: SurveyResponse = await this.surveyDao.getSurveyResponseById(weddingId, surveyId, surveyResponseId);
            response.status(200).json(surveyResponse);
        } catch (error) {
            Logger.error(`Error retrieving survey response with ${request.params.surveyResponseId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSurveyResponseByGuest(request: Request, response: Response, next: NextFunction) {
        try {
            const { weddingId, surveyId, guestId } = request.params;
            Logger.info(`Retrieving survey response with guestId: ${guestId}`);
            const surveyResponse: SurveyResponse = await this.surveyDao.getSurveyResponseByGuest(weddingId, surveyId, guestId);
            response.status(200).json(surveyResponse);
        } catch (error) {
            Logger.error(`Error retrieving survey response with guestId ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveSurveyResponse(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new survey response`);
            const { weddingId, surveyId } = request.params;
            const surveyResponse: SurveyResponse = request.body;
            const updatedSurveyResponse: SurveyResponse = await this.surveyDao.saveSurveyResponse(weddingId, surveyId, surveyResponse);
            Logger.info(`Successfully updated survey response for survey ${surveyId} and guest ${surveyResponse.guestId}`);
            response.status(200).json(updatedSurveyResponse);
        } catch (error) {
            Logger.error("Error updated survey response", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteSurveyResponse(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting survey response ${JSON.stringify(request.body)}`);
            const { weddingId, surveyId } = request.params;
            const surveyResponse: SurveyResponse = request.body;
            await this.surveyDao.deleteSurveyResponse(weddingId, surveyId, surveyResponse.responseId);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting survey response", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}