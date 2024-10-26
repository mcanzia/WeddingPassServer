import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Wedding } from "@/models/Wedding";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";

export class WeddingController {
    
    async getAllWeddings(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Wedding>(userAuthToken, ObjectType.WEDDING, error);
        }
    }

    async getWeddingsByOwner(userAuthToken: any, ownerId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/owner/${ownerId}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Wedding>(userAuthToken, ObjectType.WEDDING, error);
        }
    }

    async getWeddingById(userAuthToken: any, weddingId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingId}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
        }
    }

    async addWedding(userAuthToken: any, wedding: Wedding) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings`;
            await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, wedding));
            return;
        } catch (error: any) {
            ErrorHandler.handleAddError<Wedding>(userAuthToken, ObjectType.WEDDING, wedding, error);
        }
    }

    async batchAddWeddings(userAuthToken: any, weddings: Array<Wedding>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/batch`;
            await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, weddings));
            return;
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Wedding>(userAuthToken, ObjectType.WEDDING, weddings, error);
        }
    }

    async updateWedding(userAuthToken: any, wedding: Wedding) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${wedding.id}`;
            const response = await fetch(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, wedding));
            return response;
        } catch (error: any) {
            ErrorHandler.handleUpdateError(ObjectType.WEDDING);
        }
    }

    async deleteWedding(userAuthToken: any, wedding: Wedding) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings`;
            await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, wedding));
            return;
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Wedding>(ObjectType.WEDDING);
        }
    }

    async batchDeleteWeddings(userAuthToken: any, weddings: Array<Wedding>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/batch`;
            const response = await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, weddings));
            return response;
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Wedding>(ObjectType.WEDDING);
        }
    }
}
