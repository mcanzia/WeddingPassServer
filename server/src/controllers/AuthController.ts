import { injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { CustomError } from '../util/error/CustomError';
import { firebaseAdmin } from '../configs/firebase';
import { Role } from '../models/Role';

@injectable()
export class AuthController {

    async getUserRoles(request : Request, response : Response, next : NextFunction) {
        try {
            const userId = request.params.userId;
            if (!userId) {
                throw new CustomError('User not found');
            }
            Logger.info(`Retrieving user roles for: ${userId}`);
            const userRecord = await firebaseAdmin.auth().getUser(userId);
            const customClaims = userRecord.customClaims;
            response.status(200).json(customClaims || []);
        } catch (error) {
            Logger.error(`Error retrieving claims for ${request.params.userId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async setUserRole(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.params.userId;
            Logger.info(`Setting user role for: ${userId}`);
            const role: Role = request.body;
            await firebaseAdmin.auth().setCustomUserClaims(userId, { role: role.role });
            response.status(200).send();
        } catch (error) {
            Logger.error("Error setting user role", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}