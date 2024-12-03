import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Guest } from "../models/Guest";
import { CustomError } from '../util/error/CustomError';
import { GuestDao } from '../dao/GuestDao';
import { TYPES } from '../configs/types';
import { GuestService } from '../services/GuestService';
import { UploadValidation } from '../models/UploadValidation';

@injectable()
export class GuestController {

    constructor(@inject(TYPES.GuestDao) private guestDao: GuestDao, @inject(TYPES.GuestService) private guestService: GuestService) { }

    async getGuests(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all guests`);

            const { weddingId } = request.params;

            const guests: Array<Guest> = await this.guestDao.getAllGuests(weddingId);

            Logger.info(`Number of guests retrieved successfully: ${guests.length}`);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error("Error retrieving guests");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestbyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guest with ID: ${request.params.guestId}`);
            const { weddingId, guestId } = request.params;
            const guest: Guest = await this.guestDao.getGuestById(weddingId, guestId);
            response.status(200).json(guest);
        } catch (error) {
            Logger.error(`Error retrieving guest with ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestbyName(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guest with name: ${request.params.guestName}`);
            const { weddingId, guestName } = request.params;
            const guest: Guest = await this.guestDao.getGuestByName(weddingId, guestName);
            response.status(200).json(guest);
        } catch (error) {
            Logger.error(`Error retrieving guest with ${request.params.guestName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async fetchPartyMembers(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving party members for guest: ${request.params.guestId}`);
            const { weddingId, guestId } = request.params;
            const guests: Array<Guest> = await this.guestDao.fetchPartyMembers(weddingId, guestId);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error(`Error retrieving party members for guest ${request.params.guestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestsByPhone(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guests with phone: ${request.params.guestPhone}`);
            const { weddingId, guestPhone } = request.params;
            const guests: Array<Guest> = await this.guestDao.getGuestsByPhone(weddingId, guestPhone);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error(`Error retrieving guests with ${request.params.guestPhone}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestsbyEmail(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guests with email: ${request.params.guestEmail}`);
            const { weddingId, guestEmail } = request.params;
            const guests: Array<Guest> = await this.guestDao.getGuestsByEmail(weddingId, guestEmail);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error(`Error retrieving guests with ${request.params.guestEmail}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestbySerialNumber(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guest with serial number: ${request.params.serialNumber}`);
            const { weddingId, serialNumber } = request.params;
            const guest: Guest = await this.guestDao.getGuestBySerialNumber(weddingId, serialNumber);
            response.status(200).json(guest);
        } catch (error) {
            Logger.error(`Error retrieving guest with ${request.params.serialNumber}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getGuestsForEvent(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guests for event: ${request.params.eventId}`);
            const { weddingId, eventId } = request.params;
            const guests: Array<Guest> = await this.guestDao.getGuestsForEvent(weddingId, eventId);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error(`Error retrieving guests for ${request.params.eventId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new guest`);
            const { weddingId } = request.params;
            const guest: Guest = request.body;
            await this.guestDao.createGuest(weddingId, guest);
            Logger.info(`Successfully added guest for ${guest.name}`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateGuests(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Batch creating new guests`);
            const { weddingId } = request.params;
            const guests: Array<Guest> = request.body;
            await this.guestDao.batchCreateGuests(weddingId, guests);
            Logger.info(`Successfully added batch guests`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding batch guests", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating guest: ${JSON.stringify(request.body)}`);
            const { weddingId, guestId } = request.params;
            const updateGuestDetails: Guest = request.body;
            await this.guestDao.updateGuest(weddingId, guestId, updateGuestDetails);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error updating guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting guest ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const guest: Guest = request.body;
            await this.guestDao.deleteGuest(weddingId, guest.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteGuests(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting guests ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const guests: Array<Guest> = request.body;
            await this.guestDao.batchDeleteGuests(weddingId, guests);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting guests", error);
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
            const { weddingId } = request.params;

            let guests: Guest[] = [];

            const fileBuffer = request.file.buffer;
            const fileExtension = request.file.originalname.split('.').pop()?.toLowerCase();

            console.log('FILE EXTENSION', fileExtension);

            if (fileExtension === 'csv') {
                guests = await this.guestService.parseCSV(fileBuffer, weddingId);
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                guests = await this.guestService.parseExcel(fileBuffer, weddingId);
            } else {
                Logger.error('Unsupported file format.');
                return response.status(415).json({ error: 'Unsupported file format.' });
            }

            if (guests.length === 0) {
                Logger.error('No guest data found in the file.');
                return response.status(422).json({ error: 'No guest data found in the file.' });
            }

            const validation: UploadValidation = await this.guestService.validateGuests(weddingId, guests);
            if (validation.validatedGuests.length === 0 && validation.uploadIssues.size === 0) {
                Logger.error('No valid guest data to upload.');
                return response.status(422).json({ error: 'No valid guest data to upload.' });
            }

            Logger.info(`Successfully validated ${validation.validatedGuests.length + validation.uploadIssues.size} guests.`);
            response.status(200).json({ ...validation, uploadIssues: Object.fromEntries(validation.uploadIssues) });
        } catch (error) {
            Logger.error("Error validating guests", error);
            if (error instanceof CustomError) {
                response.status(error.statusCode).send(error.message);
            } else {
                response.status(500).send('Internal Server Error');
            }
        }
    }
}