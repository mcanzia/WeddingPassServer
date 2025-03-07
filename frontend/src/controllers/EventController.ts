import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Event } from "@/models/Event";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";

export class EventController {

    async getAllEvents(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Event>(userAuthToken, ObjectType.EVENT, error);
            throw error;
        }
    }

    async getEventsByOwner(userAuthToken: any, ownerId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/owner/${ownerId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Event>(userAuthToken, ObjectType.EVENT, error);
            throw error;
        }
    }

    async getEventById(userAuthToken: any, eventId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveEvent(userAuthToken: any, event: Event) {
        try {
            console.log('EVENT', event);
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, event));
        } catch (error: any) {
            ErrorHandler.handleAddError<Event>(userAuthToken, ObjectType.EVENT, event, error);
            throw error;
        }
    }

    async batchAddEvents(userAuthToken: any, events: Array<Event>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, events));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Event>(userAuthToken, ObjectType.EVENT, events, error);
            throw error;
        }
    }

    // async updateEvent(userAuthToken: any, event: Event) {
    //     try {
    //         const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${event.id}`;
    //         return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, event));
    //     } catch (error: any) {
    //         ErrorHandler.handleUpdateError(ObjectType.EVENT);
    //         throw error;
    //     }
    // }

    async deleteEvent(userAuthToken: any, event: Event) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, event));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Event>(ObjectType.EVENT);
            throw error;
        }
    }

    async batchDeleteEvents(userAuthToken: any, events: Array<Event>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, events));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Event>(ObjectType.EVENT);
            throw error;
        }
    }
}
