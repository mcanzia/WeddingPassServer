import { inject, injectable } from "inversify";
import { firebaseAdmin } from "../configs/firebase";
import { AuthorizationError, CustomError } from "../util/error/CustomError";
import { WeddingRole } from "../models/WeddingRole";
import jwt from 'jsonwebtoken';
import { InviteToken } from "../models/InviteToken";
import { UserDao } from "../dao/UserDao";
import { TYPES } from "../configs/types";
import { Roles } from "../models/Roles";
import { InviteDao } from "../dao/InviteDao";
import shortid from 'shortid';

@injectable()
export class AuthService {

    constructor(@inject(TYPES.UserDao) private userDao: UserDao, @inject(TYPES.InviteDao) private inviteDao: InviteDao) { }

    static async validateAuthToken(bearer: any) {
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

    async generateInviteLink(weddingRole: WeddingRole) {
        try {
            const payload =
                weddingRole.role === Roles.GUEST ?
                    {
                        weddingRole
                    } :
                    {
                        weddingRole,
                        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                    };

            const secretKey: jwt.Secret | undefined = process.env.JWT_SECRET_KEY;
            if (secretKey) {
                const token = jwt.sign(payload, secretKey);
                return new InviteToken(token);
            }

            throw new CustomError('JWT secret cannot be found');
        } catch (error) {
            throw error;
        }
    }

    async generateInviteLinkShort(weddingRole: WeddingRole): Promise<InviteToken> {
        try {
            let token = shortid.generate();

            let existingInvite = await this.inviteDao.getInvite(token);
            while (existingInvite) {
                token = shortid.generate();
                existingInvite = await this.inviteDao.getInvite(token);
            }

            const inviteToken = new InviteToken(token, weddingRole);

            await this.inviteDao.createInvite(inviteToken);

            return inviteToken;
        } catch (error) {
            throw new CustomError('Error generating invite link: ' + error);
        }
    }

    async processInviteLink(token: string) {
        try {
            const secretKey: jwt.Secret | undefined = process.env.JWT_SECRET_KEY;
            if (secretKey) {
                const payload: any = jwt.verify(token, secretKey);
                const { weddingRole } = payload;
                return weddingRole;
                // await this.userDao.addUserToWedding(userId, weddingRole);
            } else {
                throw new CustomError('JWT secret cannot be found');
            }

        } catch (error) {
            throw error;
        }
    }

    async processInviteLinkShort(token: string): Promise<WeddingRole | null> {
        try {
            const invite = await this.inviteDao.getInvite(token);
            if (!invite) {
                throw new AuthorizationError('Invite not found or has expired.');
            }

            const { weddingRole } = invite;

            if (weddingRole) {
                if (weddingRole.role !== Roles.GUEST) {
                    this.inviteDao.deleteInvite(token);
                }
                return weddingRole;
            }
            return null;
        } catch (error) {
            if (error instanceof AuthorizationError) {
                throw error;
            }
            throw new CustomError('Error processing invite link ' + error);
        }
    }

}