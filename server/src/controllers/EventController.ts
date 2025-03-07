import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Event } from "../models/Event";
import { CustomError } from '../util/error/CustomError';
import { TYPES } from '../configs/types';
import { EventDao } from '../dao/EventDao';
import { UserDao } from '../dao/UserDao';
import { EventRole } from '../models/EventRole';
import { Roles } from '../models/Roles';

@injectable()
export class EventController {

    constructor(@inject(TYPES.EventDao) private eventDao: EventDao, @inject(TYPES.UserDao) private userDao: UserDao) { }

    async getEvents(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all events`);

            const events: Array<Event> = await this.eventDao.getAllEvents();

            Logger.info(`Number of events retrieved successfully: ${events.length}`);
            response.status(200).json(events);
        } catch (error) {
            Logger.error("Error retrieving events");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getEventsByOwner(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving events for owner ${request.params.ownerId}`);
            const ownerId: string = request.params.ownerId;

            const events: Array<Event> = await this.eventDao.getEventsByOwner(ownerId);

            Logger.info(`Number of events retrieved successfully: ${events.length}`);
            response.status(200).json(events);
        } catch (error) {
            Logger.error("Error retrieving events");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getEventById(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving event with ID: ${request.params.eventId}`);
            const eventId: string = request.params.eventId;
            const event: Event = await this.eventDao.getEventById(eventId);
            response.status(200).json(event);
        } catch (error) {
            Logger.error(`Error retrieving event with ${request.params.eventId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getEventByName(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving event with name: ${request.params.eventName}`);
            const eventName: string = request.params.eventName;
            const event: Event = await this.eventDao.getEventByName(eventName);
            response.status(200).json(event);
        } catch (error) {
            Logger.error(`Error retrieving event with ${request.params.eventName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new event`);
            const event: Event = request.body;
            const newEvent: Event = await this.eventDao.createEvent(event);
            Logger.info(`Successfully added event for ${event.name}`);
            response.status(200).send(newEvent);
        } catch (error) {
            Logger.error("Error adding event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateEvents(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Batch creating new events`);
            const events: Array<Event> = request.body;
            await this.eventDao.batchCreateEvents(events);
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
            const eventId = request.params.eventId;
            const updateEventDetails: Event = request.body;
            await this.eventDao.updateEvent(eventId, updateEventDetails);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error updating event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting event ${JSON.stringify(request.body)}`);
            const event: Event = request.body;
            await this.eventDao.deleteEvent(event.id!);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting event", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteEvents(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting events ${JSON.stringify(request.body)}`);
            const events: Array<Event> = request.body;
            await this.eventDao.batchDeleteEvents(events);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting events", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}