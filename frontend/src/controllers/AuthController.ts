import { ErrorHandler } from "@/util/error/ErrorHandler";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";
import { User } from "@/models/User";
import { InviteToken } from "@/models/InviteToken";

export class AuthController {

    async getAllUsers(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<User>(userAuthToken, ObjectType.USER, error);
            throw error;
        }
    }

    async getUserById(userAuthToken: any, uid: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/id/${uid}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getUserByPhone(userAuthToken: any, phone: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/phone/${phone}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getUserByEmail(userAuthToken: any, email: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/email/${email}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getUserRoles(userAuthToken: any, userId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/roles/${userId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async setUserRole(userAuthToken: any, userId: string, role: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/roles/${userId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, role));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.ROLE);
            throw error;
        }
    }

    async saveUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, user));
        } catch (error: any) {
            ErrorHandler.handleAddError<User>(userAuthToken, ObjectType.USER, user, error);
            throw error;
        }
    }

    // async updateUser(userAuthToken: any, user: User) {
    //     try {
    //         const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/${user.id}`;
    //         return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, user));
    //     } catch (error: any) {
    //         ErrorHandler.handleUpdateError(ObjectType.USER);
    //         throw error;
    //     }
    // }

    async deleteUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, user));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<User>(ObjectType.USER);
            throw error;
        }
    }

    async generateInviteLink(userAuthToken: any, newEventRole: EventRole, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/${eventRole.event.id}/invite`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, newEventRole, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGenerateInviteLinkError();
            throw error;
        }
    }

    async processInvite(userAuthToken: any, token: InviteToken) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/process-invite`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, token));
        } catch (error: any) {
            ErrorHandler.handleProcessInviteLinkError();
            throw error;
        }
    }

    async addUserToEvent(userAuthToken: any, newEventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/users/roles`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, newEventRole));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.USER);
            throw error;
        }
    }

}
