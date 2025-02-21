import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Survey } from "@/models/Survey";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";

export class SurveyController {

    async getAllSurveys(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/surveys`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getPublishedSurveys(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/surveys/published`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getSurveyById(userAuthToken: any, eventRole: EventRole, surveyId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/surveys/id/${surveyId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveSurvey(userAuthToken: any, eventRole: EventRole, survey: Survey) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/surveys`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, survey, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Survey>(userAuthToken, ObjectType.SURVEY, survey, error);
            throw error;
        }
    }

    async deleteSurvey(userAuthToken: any, eventRole: EventRole, survey: Survey) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/surveys`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, survey, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Survey>(ObjectType.SURVEY);
            throw error;
        }
    }
}
