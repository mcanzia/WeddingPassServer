import { ErrorHandler } from "@/util/error/ErrorHandler";
import { SubEvent } from "@/models/SubEvent";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";

export class SubEventController {

    async getAllSubEvents(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/subevents`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<SubEvent>(userAuthToken, ObjectType.SUBEVENT, error);
            throw error;
        }
    }

    async getSubEventById(userAuthToken: any, eventRole: EventRole, subEventId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/subevents/id/${subEventId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveSubEvent(userAuthToken: any, eventRole: EventRole, subEvent: SubEvent) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/subevents`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, subEvent, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<SubEvent>(userAuthToken, ObjectType.SUBEVENT, subEvent, error);
            throw error;
        }
    }

    async batchAddSubEvents(userAuthToken: any, eventRole: EventRole, subEvents: Array<SubEvent>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/subevents/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, subEvents, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<SubEvent>(userAuthToken, ObjectType.SUBEVENT, subEvents, error);
            throw error;
        }
    }

    async deleteSubEvent(userAuthToken: any, eventRole: EventRole, subEvent: SubEvent) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/subEvents`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, subEvent, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<SubEvent>(ObjectType.SUBEVENT);
            throw error;
        }
    }

    async batchDeleteSubEvents(userAuthToken: any, eventRole: EventRole, subEvents: Array<SubEvent>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/subEvents/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, subEvents, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<SubEvent>(ObjectType.SUBEVENT);
            throw error;
        }
    }
}
