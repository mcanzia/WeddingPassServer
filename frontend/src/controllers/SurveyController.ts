import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Survey } from "@/models/Survey";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";

export class SurveyController {
    
    async getAllSurveys(userAuthToken: any, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/surveys`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Survey>(userAuthToken, ObjectType.SURVEY, error);
            throw error;
        }
    }

    async getSurveyById(userAuthToken: any, weddingRole: WeddingRole, surveyId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/surveys/id/${surveyId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveSurvey(userAuthToken: any, weddingRole: WeddingRole, survey: Survey) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/surveys`;
            return await RequestUtil.apiRequest(requestUrl,  RequestUtil.POSTRequestParams(userAuthToken, survey, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Survey>(userAuthToken, ObjectType.SURVEY, survey, error);
            throw error;
        }
    }

    async deleteSurvey(userAuthToken: any, weddingRole: WeddingRole, survey: Survey) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/surveys`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, survey, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Survey>(ObjectType.SURVEY);
            throw error;
        }
    }
}
