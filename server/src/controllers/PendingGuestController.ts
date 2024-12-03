import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { CustomError } from '../util/error/CustomError';
import { TYPES } from '../configs/types';
import { PendingGuestDao } from '../dao/PendingGuestDao';
import { PendingGuest } from '../models/PendingGuest';
import { UserDao } from '../dao/UserDao';
import { GuestInviteStatus } from '../models/GuestInviteStatus';

@injectable()
export class PendingGuestController {

    constructor(@inject(TYPES.PendingGuestDao) private pendingGuestDao: PendingGuestDao, @inject(TYPES.UserDao) private userDao: UserDao) { }

    async getPendingGuests(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all pending guests`);
            const { weddingId } = request.params;

            const pendingGuests: Array<PendingGuest> = await this.pendingGuestDao.getAllPendingGuests(weddingId);

            Logger.info(`Number of pending guests retrieved successfully: ${pendingGuests.length}`);
            response.status(200).json(pendingGuests);
        } catch (error) {
            Logger.error("Error retrieving pending guests");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getPendingGuestbyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving pending guest with ID: ${request.params.pendingGuestId}`);
            const { weddingId, pendingGuestId } = request.params;
            const pendingGuest: PendingGuest = await this.pendingGuestDao.getPendingGuestById(weddingId, pendingGuestId);
            response.status(200).json(pendingGuest);
        } catch (error) {
            Logger.error(`Error retrieving pending guest with ${request.params.pendingGuestId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async savePendingGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new pending guest`);
            const { weddingId } = request.params;
            const pendingGuest: PendingGuest = request.body;
            const updatedPendingGuest: PendingGuest = await this.pendingGuestDao.savePendingGuest(weddingId, pendingGuest);
            Logger.info(`Successfully updated pending guest for ${pendingGuest.id}`);
            response.status(200).json(updatedPendingGuest);
        } catch (error) {
            Logger.error("Error updated pending guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async linkGuestAccount(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Confirming pending guest`);
            const { weddingId } = request.params;
            const { pendingGuest, guest } = request.body;
            await this.userDao.linkGuestAccount(weddingId, pendingGuest, guest);
            Logger.info(`Successfully linked guest account for ${pendingGuest.guestName}`);
            const updatedPendingGuest: PendingGuest = await this.pendingGuestDao.savePendingGuest(weddingId, { ...pendingGuest, status: GuestInviteStatus.CONFIRMED });
            response.status(200).json(updatedPendingGuest);
        } catch (error) {
            Logger.error("Error linking guest account", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deletePendingGuest(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting pending guest ${JSON.stringify(request.body)}`);
            const { weddingId } = request.params;
            const pendingGuest: PendingGuest = request.body;
            await this.pendingGuestDao.deletePendingGuest(weddingId, pendingGuest.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting pending guest", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}