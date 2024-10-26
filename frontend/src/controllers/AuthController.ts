import { ErrorHandler } from "@/util/error/ErrorHandler";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";
import { User } from "@/models/User";

export class AuthController {

    async getAllUsers(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetAllError<User>(userAuthToken, ObjectType.USER, error);
        }
    }

    async getUserById(userAuthToken: any, uid: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${uid}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            if (response.status === 204) {
                return null;
            }
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
        }
    }

    async getUserRoles(userAuthToken: any, userId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/roles/${userId}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
        }
    }
    
    async setUserRole(userAuthToken: any, userId: string, role: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/roles/${userId}`;
            const response = await fetch(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, role));
            return response;
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.ROLE);
        }
    }

    async addUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth`;
            const response = await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, user));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleAddError<User>(userAuthToken, ObjectType.USER, user, error);
        }
    }

    async updateUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${user.id}`;
            const response = await fetch(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, user));
            return response;
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.USER);
        }
    }

    async deleteUser(userAuthToken: any, user: User) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth`;
            await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, user));
            return;
        } catch (error: any) {
            ErrorHandler.handleDeleteError<User>(ObjectType.USER);
        }
    }

}
