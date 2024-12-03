import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response } from 'express';
import Logger from '../util/logs/logger';
import { CustomError } from '../util/error/CustomError';
import { firebaseAdmin } from '../configs/firebase';
import { WeddingRole } from '../models/WeddingRole';
import { TYPES } from '../configs/types';
import { UserDao } from '../dao/UserDao';
import { User } from '../models/User';
import { AuthService } from '../services/AuthService';
import { InviteToken } from '../models/InviteToken';
import { PendingGuest } from '../models/PendingGuest';

@injectable()
export class AuthController {

    constructor(@inject(TYPES.UserDao) private userDao: UserDao, @inject(TYPES.AuthService) private authService: AuthService) { }

    async getUserRoles(request: Request, response: Response, next: NextFunction) {
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

    // async setUserRole(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         const userId = request.params.userId;
    //         Logger.info(`Setting user role for: ${userId}`);
    //         const role: WeddingRole = request.body;
    //         await firebaseAdmin.auth().setCustomUserClaims(userId, { role: role.role });
    //         response.status(204).send();
    //     } catch (error) {
    //         Logger.error("Error setting user role", error);
    //         response.status((error as CustomError).statusCode).send((error as CustomError).message);
    //     }
    // }

    async getUsers(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving all users`);

            const users: Array<User> = await this.userDao.getAllUsers();

            Logger.info(`Number of users retrieved successfully: ${users.length}`);
            response.status(200).json(users);
        } catch (error) {
            Logger.error("Error retrieving users");
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getUserById(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving user with ID: ${request.params.userId}`);
            const userId: string = request.params.userId;
            const user: User | null = await this.userDao.getUserById(userId);
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

    async getUserByPhone(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving user by phone`);
            const userPhone: string = request.params.userPhone;
            const user: User | null = await this.userDao.getUserByPhone(userPhone);
            if (user) {
                response.status(200).json(user);
            } else {
                response.status(204).send();
            }
        } catch (error) {
            Logger.error(`Error retrieving user by phone`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async getUserByEmail(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Retrieving user with email: ${request.params.userEmail}`);
            const userEmail: string = request.params.userEmail;
            const user: User | null = await this.userDao.getUserByEmail(userEmail);
            if (user) {
                response.status(200).json(user);
            } else {
                response.status(204).send();
            }
        } catch (error) {
            Logger.error(`Error retrieving user with email ${request.params.userEmail}`);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async createUser(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Creating new user`);
            const userToCreate: User = request.body;
            await this.userDao.createUser(userToCreate);
            Logger.info(`Successfully added user for ${userToCreate.id}`);
            const user: User | null = await this.userDao.getUserById(userToCreate.id);
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
            const updateUserDetails: User = request.body;
            await this.userDao.updateUser(userId, updateUserDetails);
            const user: User | null = await this.userDao.getUserById(userId);
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

    async deleteUser(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Deleting user ${JSON.stringify(request.body)}`);
            const user: User = request.body;
            await this.userDao.deleteUser(user.id);
            response.status(204).send();
        } catch (error) {
            Logger.error("Error deleting user", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async generateInviteLink(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Generating Invite Link`);
            const weddingRole: WeddingRole = request.body;
            const inviteToken: InviteToken = await this.authService.generateInviteLink(weddingRole);
            Logger.info(`Successfully created invite link for ${weddingRole.wedding.id}`);
            response.status(200).json(inviteToken);
        } catch (error) {
            Logger.error("Error generating invite link", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async processInvite(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Processing Invite Link`);
            const inviteToken: InviteToken = request.body;
            const userId: string = response.locals.userAuth;
            const weddingRole: WeddingRole = await this.authService.processInviteLink(inviteToken.token);
            Logger.info(`Successfully processed invite link for ${userId}`);
            response.status(200).send(weddingRole);
        } catch (error) {
            Logger.error("Error processing invite link", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

    async addUserToWedding(request: Request, response: Response, next: NextFunction) {
        try {
            Logger.info(`Adding user to wedding: ${JSON.stringify(request.body)}`);
            const userId: string = response.locals.userAuth;
            const newWeddingRole: WeddingRole = request.body;
            await this.userDao.addUserToWedding(userId, newWeddingRole);
            // const user: User | null = await this.userDao.getUserById(userId);
            // if (user) {
            //     response.status(200).json(user);
            // } else {
            //     response.status(204).send();
            // }
            response.status(204).send();
        } catch (error) {
            Logger.error("Error adding user to wedding", error);
            response.status((error as CustomError).statusCode).send((error as CustomError).message);
        }
    }

}