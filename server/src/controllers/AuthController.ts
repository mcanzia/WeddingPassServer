import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { CustomError } from '../util/error/CustomError';
import { firebaseAdmin } from '../configs/firebase';
import { WeddingRole } from '../models/WeddingRole';
import { TYPES } from '../configs/types';
import { UserDao } from '../dao/UserDao';
import { User } from '../models/User';

@injectable()
export class AuthController {

    constructor(@inject(TYPES.UserDao) private userDao: UserDao) {}

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
            const role: WeddingRole = request.body;
            await firebaseAdmin.auth().setCustomUserClaims(userId, { role: role.role });
            response.status(200).send();
        } catch (error) {
            Logger.error("Error setting user role", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getUsers(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving all users`);

            const users : Array<User> = await this.userDao.getAllUsers();
            
            Logger.info(`Number of users retrieved successfully: ${users.length}`);
            response.status(200).json(users);
        } catch (error) {
            Logger.error("Error retrieving users");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getUserById(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Retrieving user with ID: ${request.params.userId}`);
            const userId : string = request.params.userId;
            const user : User | null = await this.userDao.getUserById(userId);
            if (user) {
                response.status(200).json(user);
            } else {
                response.status(204).send();
            }
        } catch (error) {
            Logger.error(`Error retrieving user with ${request.params.userId}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createUser(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Creating new user`);
            const userToCreate: User = request.body;
            await this.userDao.createUser(userToCreate);
            Logger.info(`Successfully added user for ${userToCreate.id}`);
            const user : User | null = await this.userDao.getUserById(userToCreate.id);
            if (user) {
                response.status(200).json(user);
            } else {
                response.status(204).send();
            }
        } catch (error) {
            Logger.error("Error adding user", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async updateUser(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Updating user: ${JSON.stringify(request.body)}`);
            const userId = request.params.userId;
            const updateUserDetails : User = request.body;
            await this.userDao.updateUser(userId, updateUserDetails);
            const user : User | null = await this.userDao.getUserById(userId);
            if (user) {
                response.status(200).json(user);
            } else {
                response.status(204).send();
            }
        } catch (error) {
            Logger.error("Error updating user", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async deleteUser(request : Request, response : Response, next : NextFunction) {
        try {
            Logger.info(`Deleting user ${JSON.stringify(request.body)}`);
            const user : User = request.body;
            await this.userDao.deleteUser(user.id);
            response.status(200).send('Success');
        } catch (error) {
            Logger.error("Error deleting user", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}