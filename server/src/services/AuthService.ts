import { inject, injectable } from "inversify";
import { firebaseAdmin } from "../configs/firebase";
import { AuthorizationError, CustomError } from "../util/error/CustomError";
import { WeddingRole } from "../models/WeddingRole";
import jwt from 'jsonwebtoken';
import { InviteToken } from "../models/InviteToken";
import { UserDao } from "../dao/UserDao";
import { TYPES } from "../configs/types";

@injectable()
export class AuthService {

    constructor(@inject(TYPES.UserDao) private userDao: UserDao) {}

    static async validateAuthToken(bearer : any) {
        if (!bearer || !bearer.startsWith("Bearer ")) {
            throw new AuthorizationError("Error occurred while attempting to authorize user.");
        }
        const [_, userAuthToken] = bearer.trim().split(" ");
        if (!userAuthToken) {
            throw new AuthorizationError("Error occurred while attempting to authorize user.");
        }
        try {
            const userDetails = await firebaseAdmin.auth().verifyIdToken(userAuthToken);
            return userDetails;
        } catch (error) {
            throw new AuthorizationError("User is not authorized: " + error);
        }
    }

    async generateInviteLink(weddingRole : WeddingRole) {
        try {
            const payload = {
                weddingRole,
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
              };
            
              const secretKey : jwt.Secret | undefined = process.env.JWT_SECRET_KEY;
              if (secretKey) {
                const token = jwt.sign(payload, secretKey);
                return new InviteToken(token);
              }
            
              throw new CustomError('JWT secret cannot be found');
        } catch (error) {
            throw error;
        }
    }

    async processInviteLink(token : string, userId: string) {
        try {
              const secretKey : jwt.Secret | undefined = process.env.JWT_SECRET_KEY;
              if (secretKey) {
                const payload : any = jwt.verify(token, secretKey);
                const {weddingRole} = payload;
                await this.userDao.addUserToWedding(userId, weddingRole);
              } else {
                throw new CustomError('JWT secret cannot be found');
              }
              
        } catch (error) {
            throw error;
        }
    }
}