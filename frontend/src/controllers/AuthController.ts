import { ErrorHandler } from "@/util/error/ErrorHandler";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";
import { User } from "@/models/User";
import { InviteToken } from "@/models/InviteToken";

export class AuthController {

    async getAllUsers(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<User>(userAuthToken, ObjectType.USER, error);
            throw error;
        }
    }

    async getUserById(userAuthToken: any, uid: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${uid}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getUserRoles(userAuthToken: any, userId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/roles/${userId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async setUserRole(userAuthToken: any, userId: string, role: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/roles/${userId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, role));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.ROLE);
            throw error;
        }
    }

    async addUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, user));
        } catch (error: any) {
            ErrorHandler.handleAddError<User>(userAuthToken, ObjectType.USER, user, error);
            throw error;
        }
    }

    async updateUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${user.id}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, user));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.USER);
            throw error;
        }
    }

    async deleteUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, user));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<User>(ObjectType.USER);
            throw error;
        }
    }

    async generateInviteLink(userAuthToken: any, newWeddingRole: WeddingRole, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${weddingRole.wedding.id}/invite`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, newWeddingRole, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGenerateInviteLinkError();
            throw error;
        }
    }

    async processInvite(userAuthToken: any, token: InviteToken) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/process-invite`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, token));
        } catch (error: any) {
            ErrorHandler.handleProcessInviteLinkError();
            throw error;
        }
    }

    async addUserToWedding(userAuthToken: any, newWeddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/roles`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, newWeddingRole));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.USER);
            throw error;
        }
    }

}
