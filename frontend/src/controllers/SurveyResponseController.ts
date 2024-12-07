import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Survey } from "@/models/Survey";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";
import { SurveyResponse } from "@/models/SurveyResponse";

export class SurveyResponseController {

    getSurveyBaseUrl(weddingRole: WeddingRole) {
        return `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/surveys`;
    }

    async getAllSurveyResponses(userAuthToken: any, weddingRole: WeddingRole, surveyId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${surveyId}/response`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getAllSurveyResponsesForGuest(userAuthToken: any, weddingRole: WeddingRole, guestId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/response/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getSurveyResponseById(userAuthToken: any, weddingRole: WeddingRole, surveyId: string, surveyResponseId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${surveyId}/response/id/${surveyResponseId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getSurveyResponseByGuest(userAuthToken: any, weddingRole: WeddingRole, surveyId: string, guestId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${surveyId}/response/guest/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveSurveyResponse(userAuthToken: any, weddingRole: WeddingRole, surveyResponse: SurveyResponse) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${surveyResponse.survey.id}/response`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, surveyResponse, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<SurveyResponse>(userAuthToken, ObjectType.SURVEY_RESPONSE, surveyResponse, error);
            throw error;
        }
    }

    async initializeSurveysForParty(userAuthToken: any, weddingRole: WeddingRole, guestId: string, survey: Survey) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${survey.id}/response/party/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, survey, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.SURVEY_RESPONSE);
            throw error;
        }
    }

    async fetchPartySurveyResponses(userAuthToken: any, weddingRole: WeddingRole, surveyId: string, guestId: string) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${surveyId}/response/party/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.SURVEY_RESPONSE);
            throw error;
        }
    }

    async deleteSurveyResponse(userAuthToken: any, weddingRole: WeddingRole, surveyId: string, surveyResponse: SurveyResponse) {
        try {
            const requestUrl = `${this.getSurveyBaseUrl(weddingRole)}/${surveyId}/response`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, surveyResponse, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<SurveyResponse>(ObjectType.SURVEY_RESPONSE);
            throw error;
        }
    }

}
