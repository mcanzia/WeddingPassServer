import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { Wedding } from "../models/Wedding";
import { CustomError } from '../util/error/CustomError';
import { TYPES } from '../configs/types';
import { WeddingDao } from '../dao/WeddingDao';
import { UserDao } from '../dao/UserDao';
import { WeddingRole } from '../models/WeddingRole';
import { Roles } from '../models/Roles';

@injectable()
export class WeddingController {

    constructor(@inject(TYPES.WeddingDao) private weddingDao: WeddingDao, @inject(TYPES.UserDao) private userDao: UserDao) {}

    async getWeddings(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving all weddings`);

            const weddings : Array<Wedding> = await this.weddingDao.getAllWeddings();
            
            Logger.info(`Number of weddings retrieved successfully: ${weddings.length}`);
            response.status(200).json(weddings);
        } catch (error) {
            Logger.error("Error retrieving weddings");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getWeddingsByOwner(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving weddings for owner ${request.params.ownerId}`);
            const ownerId : string = request.params.ownerId;

            const weddings : Array<Wedding> = await this.weddingDao.getWeddingsByOwner(ownerId);
            
            Logger.info(`Number of weddings retrieved successfully: ${weddings.length}`);
            response.status(200).json(weddings);
        } catch (error) {
            Logger.error("Error retrieving weddings");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getWeddingById(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving wedding with ID: ${request.params.weddingId}`);
            const weddingId : string = request.params.weddingId;
            const wedding : Wedding = await this.weddingDao.getWeddingById(weddingId);
            response.status(200).json(wedding);
        } catch (error) {
            Logger.error(`Error retrieving wedding with ${request.params.weddingId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getWeddingByName(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving wedding with name: ${request.params.weddingName}`);
            const weddingName : string = request.params.weddingName;
            const wedding : Wedding = await this.weddingDao.getWeddingByName(weddingName);
            response.status(200).json(wedding);
        } catch (error) {
            Logger.error(`Error retrieving wedding with ${request.params.weddingName}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createWedding(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Creating new wedding`);
            const wedding: Wedding = request.body;
            const newWedding : Wedding = await this.weddingDao.createWedding(wedding);
            Logger.info(`Successfully added wedding for ${wedding.name}`);
            const ownerRole : WeddingRole = new WeddingRole(Roles.ADMIN, newWedding);
            await this.userDao.addUserToWedding(newWedding.ownerId, ownerRole);
            Logger.info(`Successfully added user ${newWedding.ownerId} as owner for ${wedding.name}`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding wedding", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchCreateWeddings(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Batch creating new weddings`);
            const weddings: Array<Wedding> = request.body;
            await this.weddingDao.batchCreateWeddings(weddings);
            Logger.info(`Successfully added batch weddings`);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding batch weddings", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateWedding(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating wedding: ${JSON.stringify(request.body)}`);
            const weddingId = request.params.weddingId;
            const updateWeddingDetails : Wedding = request.body;
            await this.weddingDao.updateWedding(weddingId, updateWeddingDetails);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error updating wedding", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteWedding(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting wedding ${JSON.stringify(request.body)}`);
            const wedding : Wedding = request.body;
            await this.weddingDao.deleteWedding(wedding.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting wedding", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async batchDeleteWeddings(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting weddings ${JSON.stringify(request.body)}`);
            const weddings: Array<Wedding> = request.body;
            await this.weddingDao.batchDeleteWeddings(weddings);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error batch deleting weddings", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }
}