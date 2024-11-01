import { ErrorHandler } from "@/util/error/ErrorHandler";
import { WeddingEvent } from "@/models/WeddingEvent";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";

export class EventController {
    
    async getAllEvents(userAuthToken: any, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/events`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<WeddingEvent>(userAuthToken, ObjectType.EVENT, error);
            throw error;
        }
    }

    async getEventById(userAuthToken: any, weddingRole: WeddingRole, eventId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/events/${eventId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async addEvent(userAuthToken: any, weddingRole: WeddingRole, event: WeddingEvent) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/events`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, event, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<WeddingEvent>(userAuthToken, ObjectType.EVENT, event, error);
            throw error;
        }
    }

    async batchAddEvents(userAuthToken: any, weddingRole: WeddingRole, events: Array<WeddingEvent>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/events/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, events, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<WeddingEvent>(userAuthToken, ObjectType.EVENT, events, error);
            throw error;
        }
    }

    async deleteEvent(userAuthToken: any, weddingRole: WeddingRole, event: WeddingEvent) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/events`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, event, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<WeddingEvent>(ObjectType.EVENT);
            throw error;
        }
    }

    async batchDeleteEvents(userAuthToken: any, weddingRole: WeddingRole, events: Array<WeddingEvent>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/events/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, events, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<WeddingEvent>(ObjectType.EVENT);
            throw error;
        }
    }
}
