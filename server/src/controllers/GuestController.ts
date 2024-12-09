import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Guest } from "../models/Guest";
import { CustomError } from '../util/error/CustomError';
import { GuestDao } from '../dao/GuestDao';
import { TYPES } from '../configs/types';
import { GuestService } from '../services/GuestService';
import { UploadValidation } from '../models/UploadValidation';
import { UploadGuestLists } from '../models/UploadGuestLists';

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

    async getGuestsByHotel(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving guests for hotel: ${request.params.hotelId}`);
            const { weddingId, hotelId } = request.params;
            const guests: Array<Guest> = await this.guestDao.getGuestsByHotel(weddingId, hotelId);
            response.status(200).json(guests);
        } catch (error) {
            Logger.error(`Error retrieving guests with hotel ${request.params.hotelId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async saveGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Saving guest`);
            const { weddingId } = request.params;
            const guest: Guest = request.body;
            await this.guestDao.saveGuest(weddingId, guest);
            Logger.info(`Successfully saved guest for ${guest.name}`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error saving guest", error);
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

    async batchUpdateGuests(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Batch updating guests`);
            const { weddingId } = request.params;
            const guests: Array<Guest> = request.body;
            await this.guestDao.batchUpdateGuests(weddingId, guests);
            Logger.info(`Successfully updated batch guests`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error updating batch guests", error);
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

            let guestLists: UploadGuestLists;

            const fileBuffer = request.file.buffer;
            const fileExtension = request.file.originalname.split('.').pop()?.toLowerCase();

            if (fileExtension === 'csv') {
                guestLists = await this.guestService.parseCSV(fileBuffer, weddingId);
            } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
                guestLists = await this.guestService.parseExcel(fileBuffer, weddingId);
            } else {
                Logger.error('Unsupported file format.');
                return response.status(415).json({ error: 'Unsupported file format.' });
            }

            if (!guestLists.createGuests.length && !guestLists.updateGuests.length) {
                Logger.error('No guest data found in the file.');
                return response.status(422).json({ error: 'No guest data found in the file.' });
            }

            const validation: UploadValidation = await this.guestService.validateGuests(weddingId, guestLists);
            if (!validation.uploadGuestLists.createGuests.length && !validation.uploadGuestLists.updateGuests.length && validation.uploadIssues.size === 0) {
                Logger.error('No valid guest data to upload.');
                return response.status(422).json({ error: 'No valid guest data to upload.' });
            }

            Logger.info(`Successfully validated ${validation.uploadGuestLists.createGuests.length + validation.uploadGuestLists.updateGuests.length + validation.uploadIssues.size} guests.`);
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

    async downloadGuests(request: Request, response: Response, next: NextFunction) {
        try {

            const { weddingId } = request.params;
            const guests = await this.guestDao.getAllGuests(weddingId);
            if (!guests || guests.length === 0) {
                return response.status(204).json({ message: 'No guests found' });
            }

            const csv = await this.guestService.generateCSVContent(guests);

            response.attachment('guests.csv');
            response.type('text/csv');

            response.status(200).send(csv);

        } catch (error) {
            Logger.error("Error downloading csv", error);
            response.status(500).send((error as CustomError).message);
        }
    }
}