import { ErrorHandler } from "@/util/error/ErrorHandler";
import { WeddingEvent } from "@/models/WeddingEvent";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";

export class EventController {
    
    async getAllEvents(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetAllError<WeddingEvent>(userAuthToken, ObjectType.EVENT, error);
        }
    }

    async getEventById(userAuthToken: any, eventId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventId}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetByIdError<WeddingEvent>(userAuthToken, ObjectType.EVENT, eventId, error);
        }
    }

    async addEvent(userAuthToken: any, event: WeddingEvent) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events`;
            await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, event));
            return;
        } catch (error: any) {
            ErrorHandler.handleAddError<WeddingEvent>(userAuthToken, ObjectType.EVENT, event, error);
        }
    }

    async batchAddEvents(userAuthToken: any, events: Array<WeddingEvent>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/batch`;
            await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, events));
            return;
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<WeddingEvent>(userAuthToken, ObjectType.EVENT, events, error);
        }
    }

    async deleteEvent(userAuthToken: any, event: WeddingEvent) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events`;
            await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, event));
            return;
        } catch (error: any) {
            ErrorHandler.handleDeleteError<WeddingEvent>(ObjectType.EVENT);
        }
    }

    async batchDeleteEvents(userAuthToken: any, events: Array<WeddingEvent>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/batch`;
            const response = await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, events));
            return response;
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<WeddingEvent>(ObjectType.EVENT);
        }
    }
}
