import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Wedding } from "@/models/Wedding";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";

export class WeddingController {
    
    async getAllWeddings(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Wedding>(userAuthToken, ObjectType.WEDDING, error);
            throw error;
        }
    }

    async getWeddingsByOwner(userAuthToken: any, ownerId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/owner/${ownerId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Wedding>(userAuthToken, ObjectType.WEDDING, error);
            throw error;
        }
    }

    async getWeddingById(userAuthToken: any, weddingId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async addWedding(userAuthToken: any, wedding: Wedding) {
        try {
            console.log('WEDDING', wedding);
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, wedding));
        } catch (error: any) {
            ErrorHandler.handleAddError<Wedding>(userAuthToken, ObjectType.WEDDING, wedding, error);
            throw error;
        }
    }

    async batchAddWeddings(userAuthToken: any, weddings: Array<Wedding>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, weddings));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Wedding>(userAuthToken, ObjectType.WEDDING, weddings, error);
            throw error;
        }
    }

    async updateWedding(userAuthToken: any, wedding: Wedding) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${wedding.id}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, wedding));
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.WEDDING);
            throw error;
        }
    }

    async deleteWedding(userAuthToken: any, wedding: Wedding) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, wedding));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Wedding>(ObjectType.WEDDING);
            throw error;
        }
    }

    async batchDeleteWeddings(userAuthToken: any, weddings: Array<Wedding>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, weddings));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Wedding>(ObjectType.WEDDING);
            throw error;
        }
    }
}
