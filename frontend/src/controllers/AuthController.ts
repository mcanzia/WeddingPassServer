import { ErrorHandler } from "@/util/error/ErrorHandler";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { Role } from "@/models/Role";

export class AuthController {

    async getUserRoles(userAuthToken: any, userId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${userId}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
        }
    }
    
    async setUserRole(userAuthToken: any, userId: string, role: Role) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/auth/${userId}`;
            const response = await fetch(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, role));
            return response;
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.ROLE);
        }
    }

}
