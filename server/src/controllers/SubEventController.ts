import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { SubEvent } from "../models/SubEvent";
import { CustomError } from '../util/error/CustomError';
import { SubEventDao } from '../dao/SubEventDao';
import { TYPES } from '../configs/types';

@injectable()
export class SubEventController {

    constructor(@inject(TYPES.SubEventDao) private subEventDao: SubEventDao) { }

    async getSubEvents(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all subevents`);
            const { eventId } = request.params;

            const subEvents: Array<SubEvent> = await this.subEventDao.getAllSubEvents(eventId);

            Logger.info(`Number of subevents retrieved successfully: ${subEvents.length}`);
            response.status(200).json(subEvents);
        } catch (error) {
            Logger.error("Error retrieving subevents");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSubEventbyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving subevent with ID: ${request.params.eventId}`);
            const { eventId, subEventId } = request.params;
            const subEvent: SubEvent = await this.subEventDao.getSubEventById(eventId, subEventId);
            response.status(200).json(subEvent);
        } catch (error) {
            Logger.error(`Error retrieving subevent with ${request.params.subEventId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getSubEventbyName(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving subevent with name: ${request.params.subEventName}`);
            const { eventId, subEventName } = request.params;
            const subEvent: SubEvent = await this.subEventDao.getSubEventByName(eventId, subEventName);
            response.status(200).json(subEvent);
        } catch (error) {
            Logger.error(`Error retrieving subEvent with ${request.params.subEventName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createSubEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new subevent`);
            const { eventId } = request.params;
            const subEvent: SubEvent = request.body;
            await this.subEventDao.createSubEvent(eventId, subEvent);
            Logger.info(`Successfully added subevent for ${subEvent.name}`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding subevent", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateSubEvents(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Batch creating new subevents`);
            const { eventId } = request.params;
            const subEvents: Array<SubEvent> = request.body;
            await this.subEventDao.batchCreateSubEvents(eventId, subEvents);
            Logger.info(`Successfully added batch subevents`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding batch subevents", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateSubEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating sub event: ${JSON.stringify(request.body)}`);
            const { eventId, subEventId } = request.params;
            const updateSubEventDetails: SubEvent = request.body;
            await this.subEventDao.updateSubEvent(eventId, subEventId, updateSubEventDetails);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error updating subevent", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteSubEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting event ${JSON.stringify(request.body)}`);
            const { eventId } = request.params;
            const event: SubEvent = request.body;
            await this.subEventDao.deleteSubEvent(eventId, event.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteSubEvents(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting subevents ${JSON.stringify(request.body)}`);
            const { subEventId } = request.params;
            const subEvents: Array<SubEvent> = request.body;
            await this.subEventDao.batchDeleteSubEvents(subEventId, subEvents);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting subevents", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}