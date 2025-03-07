import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Accommodation } from "@/models/Accommodation";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";

export class AccommodationController {

    async getAllAccommodations(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/accommodations/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Accommodation>(userAuthToken, ObjectType.HOTEL, error);
            throw error;
        }
    }

    async getAccommodationById(userAuthToken: any, eventRole: EventRole, accommodationId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/accommodations/id/${accommodationId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveAccommodation(userAuthToken: any, eventRole: EventRole, accommodation: Accommodation) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/accommodations/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, accommodation, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Accommodation>(userAuthToken, ObjectType.HOTEL, accommodation, error);
            throw error;
        }
    }

    async batchAddAccommodations(userAuthToken: any, eventRole: EventRole, accommodations: Array<Accommodation>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/accommodations/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, accommodations, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Accommodation>(userAuthToken, ObjectType.HOTEL, accommodations, error);
            throw error;
        }
    }

    async deleteAccommodation(userAuthToken: any, eventRole: EventRole, accommodation: Accommodation) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/accommodations/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, accommodation, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Accommodation>(ObjectType.HOTEL);
            throw error;
        }
    }

    async batchDeleteAccommodations(userAuthToken: any, eventRole: EventRole, accommodations: Array<Accommodation>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/accommodations/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, accommodations, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Accommodation>(ObjectType.HOTEL);
            throw error;
        }
    }
}
