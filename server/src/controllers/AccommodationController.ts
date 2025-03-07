import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { CustomError } from '../util/error/CustomError';
import { AccommodationDao } from '../dao/AccommodationDao';
import { TYPES } from '../configs/types';
import { Accommodation } from '../models/Accommodation';

@injectable()
export class AccommodationController {

    constructor(@inject(TYPES.AccommodationDao) private accommodationDao: AccommodationDao) { }

    async getAccommodations(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all accommodations`);
            const { eventId } = request.params;

            const accommodations: Array<Accommodation> = await this.accommodationDao.getAllAccommodations(eventId);

            Logger.info(`Number of accommodations retrieved successfully: ${accommodations.length}`);
            response.status(200).json(accommodations);
        } catch (error) {
            Logger.error("Error retrieving accommodations");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getAccommodationbyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving accommodation with ID: ${request.params.accommodationId}`);
            const { eventId, accommodationId } = request.params;
            const accommodation: Accommodation = await this.accommodationDao.getAccommodationById(eventId, accommodationId);
            response.status(200).json(accommodation);
        } catch (error) {
            Logger.error(`Error retrieving accommodation with ${request.params.accommodationId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveAccommodation(request: Request, response: Response, next: NextFunction) {
        try {
            const { eventId } = request.params;
            const accommodation: Accommodation = request.body;
            const updatedAccommodation: Accommodation = await this.accommodationDao.saveAccommodation(eventId, accommodation);
            Logger.info(`Successfully updated accommodation for ${accommodation.name}`);
            response.status(200).json(updatedAccommodation);
        } catch (error) {
            Logger.error("Error updated accommodation", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateAccommodations(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Batch creating new accommodations`);
            const { eventId } = request.params;
            const accommodations: Array<Accommodation> = request.body;
            await this.accommodationDao.batchCreateAccommodations(eventId, accommodations);
            Logger.info(`Successfully added batch accommodations`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding batch accommodations", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteAccommodation(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting accommodation ${JSON.stringify(request.body)}`);
            const { eventId } = request.params;
            const accommodation: Accommodation = request.body;
            await this.accommodationDao.deleteAccommodation(eventId, accommodation.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting accommodation", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteAccommodations(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting accommodations ${JSON.stringify(request.body)}`);
            const { eventId } = request.params;
            const accommodations: Array<Accommodation> = request.body;
            await this.accommodationDao.batchDeleteAccommodations(eventId, accommodations);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting accommodations", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}