import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Pass } from "../models/Pass";
import { CustomError } from '../util/error/CustomError';
import { PassDao } from '../dao/PassDao';
import { TYPES } from '../configs/types';
import { GuestDao } from '../dao/GuestDao';
import { Guest } from '../models/Guest';
import { createGuestSpecificPass } from '../util/create-pass';

@injectable()
export class PassController {

    constructor(@inject(TYPES.PassDao) private passDao: PassDao, @inject(TYPES.GuestDao) private guestDao: GuestDao) { }

    async getPasses(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all passes`);

            const passes: Array<Pass> = await this.passDao.getAllPasses();

            Logger.info(`Number of passes retrieved successfully: ${passes.length}`);
            response.status(200).json(passes);
        } catch (error) {
            Logger.error("Error retrieving passes");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getPassbyId(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving pass with ID: ${request.params.passId}`);
            const passId: string = request.params.passId;
            const pass: Pass = await this.passDao.getPassById(passId);
            response.status(200).json(pass);
        } catch (error) {
            Logger.error(`Error retrieving pass with ${request.params.passId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getPassbyName(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving pass with name: ${request.params.passName}`);
            const passName: string = request.params.passName;
            const pass: Pass = await this.passDao.getPassByName(passName);
            response.status(200).json(pass);
        } catch (error) {
            Logger.error(`Error retrieving pass with ${request.params.passName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async generateNewPass(request: Request, response: Response, next: NextFunction) {
        try {
            const serialNumber = request.params.serialNumber;
            Logger.info(`Generating new pass for number ${serialNumber}`);
            if (!serialNumber) {
                return response.status(400).json({ error: 'Missing serialNumber parameter.' });
            }
            const guest: Guest = await this.guestDao.getGuestBySerialNumber(serialNumber);

            Logger.info(`User found ${guest.name}`);


            const passBuffer = await createGuestSpecificPass(guest);

            response.set({
                'Content-Type': 'application/vnd.apple.pkpass',
                'Content-Disposition': `attachment; filename=pass.pkpass`
              });
          
            response.status(200).send(passBuffer);
        } catch (error) {
            Logger.error("Error generating new pass", error);
        }
    }

    async createPass(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new pass`);
            const pass: Pass = request.body;
            await this.passDao.createPass(pass);
            Logger.info(`Successfully added pass for ${pass.name}`);
            response.status(200);
        } catch (error) {
            Logger.error("Error adding pass", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updatePass(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating pass: ${JSON.stringify(request.body)}`);
            const passId = request.params.passId;
            const updatePassDetails: Pass = request.body;
            await this.passDao.updatePass(passId, updatePassDetails);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error updating pass", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deletePass(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting pass ${JSON.stringify(request.body)}`);
            const pass: Pass = request.body;
            await this.passDao.deletePass(pass.id);
            response.status(200).send();
        } catch (error) {
            Logger.error("Error deleting pass", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}