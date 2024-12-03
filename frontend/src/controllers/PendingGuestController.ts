import { ErrorHandler } from "@/util/error/ErrorHandler";
import { PendingGuest } from "@/models/PendingGuest";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";
import { Guest } from "@/models/Guest";

export class PendingGuestController {

    async getAllPendingGuests(userAuthToken: any, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/pending-guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<PendingGuest>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getPendingGuestById(userAuthToken: any, weddingRole: WeddingRole, pendingGuestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/pending-guests/id/${pendingGuestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async savePendingGuest(userAuthToken: any, weddingRole: WeddingRole, pendingGuest: PendingGuest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/pending-guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, pendingGuest, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<PendingGuest>(userAuthToken, ObjectType.SURVEY, pendingGuest, error);
            throw error;
        }
    }

    async deletePendingGuest(userAuthToken: any, weddingRole: WeddingRole, pendingGuest: PendingGuest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/pending-guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, pendingGuest, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<PendingGuest>(ObjectType.SURVEY);
            throw error;
        }
    }

    async linkGuestAccount(userAuthToken: any, weddingRole: WeddingRole, pendingGuest: PendingGuest, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/pending-guests/link`;
            const requestBody = { pendingGuest: pendingGuest, guest: guest };
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, requestBody, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<PendingGuest>(userAuthToken, ObjectType.SURVEY, pendingGuest, error);
            throw error;
        }
    }
}
