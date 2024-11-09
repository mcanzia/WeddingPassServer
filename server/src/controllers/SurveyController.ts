import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Survey } from "../models/Survey";
import { CustomError } from '../util/error/CustomError';
import { SurveyDao } from '../dao/SurveyDao';
import { TYPES } from '../configs/types';

@injectable()
export class SurveyController {

    constructor(@inject(TYPES.SurveyDao) private surveyDao: SurveyDao) {}

    async getSurveys(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving all surveys`);
            const { weddingId } = request.params;

            const surveys : Array<Survey> = await this.surveyDao.getAllSurveys(weddingId);
            
            Logger.info(`Number of surveys retrieved successfully: ${surveys.length}`);
            response.status(200).json(surveys);
        } catch (error) {
            Logger.error("Error retrieving surveys");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSurveybyId(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving survey with ID: ${request.params.surveyId}`);
            const { weddingId, surveyId } = request.params;
            const survey : Survey = await this.surveyDao.getSurveyById(weddingId, surveyId);
            response.status(200).json(survey);
        } catch (error) {
            Logger.error(`Error retrieving survey with ${request.params.surveyId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveSurvey(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Creating new survey`);
            const { weddingId } = request.params;
            const survey: Survey = request.body;
            const updatedSurvey : Survey = await this.surveyDao.saveSurvey(weddingId, survey);
            Logger.info(`Successfully updated survey for ${survey.title}`);
            response.status(200).json(updatedSurvey);
        } catch (error) {
            Logger.error("Error updated survey", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteSurvey(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting survey ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const survey : Survey = request.body;
            await this.surveyDao.deleteSurvey(weddingId, survey.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting survey", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}