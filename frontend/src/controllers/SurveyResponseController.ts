import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Survey } from "@/models/Survey";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";
import { SurveyResponse } from "@/models/SurveyResponse";

export class SurveyResponseController {

    getSurveyBaseUrl(eventRole: EventRole) {
        return `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/surveys`;
    }

    async getAllSurveyResponses(userAuthToken: any, eventRole: EventRole, surveyId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${surveyId}/response/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getAllSurveyResponsesForGuest(userAuthToken: any, eventRole: EventRole, guestId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/response/guest/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getSurveyResponseById(userAuthToken: any, eventRole: EventRole, surveyId: string, surveyResponseId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${surveyId}/response/id/${surveyResponseId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getSurveyResponseByGuest(userAuthToken: any, eventRole: EventRole, surveyId: string, guestId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${surveyId}/response/guest/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveSurveyResponse(userAuthToken: any, eventRole: EventRole, surveyResponse: SurveyResponse) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${surveyResponse.survey.id}/response/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, surveyResponse, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<SurveyResponse>(userAuthToken, ObjectType.SURVEY_RESPONSE, surveyResponse, error);
            throw error;
        }
    }

    async initializeSurveysForParty(userAuthToken: any, eventRole: EventRole, guestId: string, survey: Survey) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${survey.id}/response/party/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, survey, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.SURVEY_RESPONSE);
            throw error;
        }
    }

    async fetchPartySurveyResponses(userAuthToken: any, eventRole: EventRole, surveyId: string, guestId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${surveyId}/response/party/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.SURVEY_RESPONSE);
            throw error;
        }
    }

    async deleteSurveyResponse(userAuthToken: any, eventRole: EventRole, surveyId: string, surveyResponse: SurveyResponse) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(eventRole)}/${surveyId}/response/`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, surveyResponse, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<SurveyResponse>(ObjectType.SURVEY_RESPONSE);
            throw error;
        }
    }

}
