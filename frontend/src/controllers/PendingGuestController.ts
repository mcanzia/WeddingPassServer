import { ErrorHandler } from "@/util/error/ErrorHandler";
import { PendingGuest } from "@/models/PendingGuest";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";
import { Guest } from "@/models/Guest";

export class PendingGuestController {

    async getAllPendingGuests(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/pending-guests/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<PendingGuest>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getPendingGuestById(userAuthToken: any, eventRole: EventRole, pendingGuestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/pending-guests/id/${pendingGuestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async savePendingGuest(userAuthToken: any, eventRole: EventRole, pendingGuest: PendingGuest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/pending-guests/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, pendingGuest, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<PendingGuest>(userAuthToken, ObjectType.SURVEY, pendingGuest, error);
            throw error;
        }
    }

    async deletePendingGuest(userAuthToken: any, eventRole: EventRole, pendingGuest: PendingGuest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/pending-guests/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, pendingGuest, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<PendingGuest>(ObjectType.SURVEY);
            throw error;
        }
    }

    async linkGuestAccount(userAuthToken: any, eventRole: EventRole, pendingGuest: PendingGuest, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/pending-guests/link`;
            const requestBody = { pendingGuest: pendingGuest, guest: guest };
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, requestBody, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<PendingGuest>(userAuthToken, ObjectType.SURVEY, pendingGuest, error);
            throw error;
        }
    }
}
