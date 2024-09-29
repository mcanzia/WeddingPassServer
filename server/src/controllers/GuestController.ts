import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Guest } from "../models/Guest";
import { CustomError } from '../util/error/CustomError';
import { GuestDao } from '../dao/GuestDao';
import { TYPES } from '../configs/types';
import { GuestService } from '../services/GuestService';

@injectable()
export class GuestController {

    constructor(@inject(TYPES.GuestDao) private guestDao: GuestDao, @inject(TYPES.GuestService) private guestService: GuestService) {}

    async getGuests(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving all guests`);

            const guests : Array<Guest> = await this.guestDao.getAllGuests();
            
            Logger.info(`Number of guests retrieved successfully: ${guests.length}`);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error("Error retrieving guests");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestbyId(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving guest with ID: ${request.params.guestId}`);
            const guestId : string = request.params.guestId;
            const guest : Guest = await this.guestDao.getGuestById(guestId);
            response.status(200).json(guest);
        } catch (error) {
            Logger.error(`Error retrieving guest with ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestbyName(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving guest with name: ${request.params.guestName}`);
            const guestName : string = request.params.guestName;
            const guest : Guest = await this.guestDao.getGuestByName(guestName);
            response.status(200).json(guest);
        } catch (error) {
            Logger.error(`Error retrieving guest with ${request.params.guestName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestbySerialNumber(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving guest with serial number: ${request.params.serialNumber}`);
            const serialNumber : string = request.params.serialNumber;
            const guest : Guest = await this.guestDao.getGuestBySerialNumber(serialNumber);
            response.status(200).json(guest);
        } catch (error) {
            Logger.error(`Error retrieving guest with ${request.params.serialNumber}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createGuest(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Creating new guest`);
            const guest: Guest = request.body;
            await this.guestDao.createGuest(guest);
            Logger.info(`Successfully added guest for ${guest.name}`);
            response.status(200);
        } catch (error) {
            Logger.error("Error adding guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateGuests(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Batch creating new guests`);
            const guests: Array<Guest> = request.body;
            await this.guestDao.batchCreateGuests(guests);
            Logger.info(`Successfully added batch guests`);
            response.status(200);
        } catch (error) {
            Logger.error("Error adding batch guests", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating guest: ${JSON.stringify(request.body)}`);
            const guestId = request.params.guestId;
            const updateGuestDetails : Guest = request.body;
            await this.guestDao.updateGuest(guestId, updateGuestDetails);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteGuest(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting guest ${JSON.stringify(request.body)}`);
            const guest : Guest = request.body;
            await this.guestDao.deleteGuest(guest.id);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error deleting guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async uploadGuests(request: Request, response: Response, next: NextFunction) {
        try {
            if (!request.file) {
                Logger.error('No file uploaded.');
                return response.status(400).json({ error: 'No file uploaded.' });
            }

            Logger.info(`Received file: ${request.file.originalname}`);

            let guests: Guest[] = [];

            const fileBuffer = request.file.buffer;
            const fileExtension = request.file.originalname.split('.').pop()?.toLowerCase();

            console.log('FILE EXTENSION', fileExtension);

            if (fileExtension === 'csv') {
                guests = await this.guestService.parseCSV(fileBuffer);
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                guests = await this.guestService.parseExcel(fileBuffer);
            } else {
                Logger.error('Unsupported file format.');
                return response.status(400).json({ error: 'Unsupported file format.' });
            }

            if (guests.length === 0) {
                Logger.error('No guest data found in the file.');
                return response.status(400).json({ error: 'No guest data found in the file.' });
            }

            const validGuests = this.guestService.validateGuests(guests);
            if (validGuests.length === 0) {
                Logger.error('No valid guest data to upload.');
                return response.status(400).json({ error: 'No valid guest data to upload.' });
            }

            await this.guestDao.batchCreateGuests(validGuests);

            Logger.info(`Successfully uploaded ${validGuests.length} guests.`);
            response.status(200).json({ message: `Successfully uploaded ${validGuests.length} guests.` });
        } catch (error) {
            Logger.error("Error uploading guests", error);
            if (error instanceof CustomError) {
                response.status(error.statusCode).send(error.message);
            } else {
                response.status(500).send('Internal Server Error');
            }
        }
    }
}