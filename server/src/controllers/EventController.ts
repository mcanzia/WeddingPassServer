import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { WeddingEvent } from "../models/WeddingEvent";
import { CustomError } from '../util/error/CustomError';
import { EventDao } from '../dao/EventDao';
import { TYPES } from '../configs/types';

@injectable()
export class EventController {

    constructor(@inject(TYPES.EventDao) private eventDao: EventDao) {}

    async getEvents(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving all events`);
            const { weddingId } = request.params;

            const events : Array<WeddingEvent> = await this.eventDao.getAllEvents(weddingId);
            
            Logger.info(`Number of events retrieved successfully: ${events.length}`);
            response.status(200).json(events);
        } catch (error) {
            Logger.error("Error retrieving events");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getEventbyId(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving event with ID: ${request.params.eventId}`);
            const { weddingId, eventId } = request.params;
            const event : WeddingEvent = await this.eventDao.getEventById(weddingId, eventId);
            response.status(200).json(event);
        } catch (error) {
            Logger.error(`Error retrieving event with ${request.params.eventId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getEventbyName(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving event with name: ${request.params.eventName}`);
            const { weddingId, eventName } = request.params;
            const event : WeddingEvent = await this.eventDao.getEventByName(weddingId, eventName);
            response.status(200).json(event);
        } catch (error) {
            Logger.error(`Error retrieving event with ${request.params.eventName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createEvent(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Creating new event`);
            const { weddingId } = request.params;
            const event: WeddingEvent = request.body;
            await this.eventDao.createEvent(weddingId, event);
            Logger.info(`Successfully added event for ${event.name}`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateEvents(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Batch creating new events`);
            const { weddingId } = request.params;
            const events: Array<WeddingEvent> = request.body;
            await this.eventDao.batchCreateEvents(weddingId, events);
            Logger.info(`Successfully added batch events`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding batch events", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating event: ${JSON.stringify(request.body)}`);
            const { weddingId, eventId } = request.params;
            const updateEventDetails : WeddingEvent = request.body;
            await this.eventDao.updateEvent(weddingId, eventId, updateEventDetails);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error updating event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteEvent(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting event ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const event : WeddingEvent = request.body;
            await this.eventDao.deleteEvent(weddingId, event.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteEvents(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting events ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const events: Array<WeddingEvent> = request.body;
            await this.eventDao.batchDeleteEvents(weddingId, events);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting events", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}