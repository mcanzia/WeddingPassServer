import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Hotel } from "@/models/Hotel";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";

export class HotelController {

    async getAllHotels(userAuthToken: any, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/hotels`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Hotel>(userAuthToken, ObjectType.HOTEL, error);
            throw error;
        }
    }

    async getHotelById(userAuthToken: any, weddingRole: WeddingRole, hotelId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/hotels/id/${hotelId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveHotel(userAuthToken: any, weddingRole: WeddingRole, hotel: Hotel) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/hotels`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, hotel, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Hotel>(userAuthToken, ObjectType.HOTEL, hotel, error);
            throw error;
        }
    }

    async batchAddHotels(userAuthToken: any, weddingRole: WeddingRole, hotels: Array<Hotel>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/hotels/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, hotels, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Hotel>(userAuthToken, ObjectType.HOTEL, hotels, error);
            throw error;
        }
    }

    async deleteHotel(userAuthToken: any, weddingRole: WeddingRole, hotel: Hotel) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/hotels`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, hotel, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Hotel>(ObjectType.HOTEL);
            throw error;
        }
    }

    async batchDeleteHotels(userAuthToken: any, weddingRole: WeddingRole, hotels: Array<Hotel>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/hotels/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, hotels, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Hotel>(ObjectType.HOTEL);
            throw error;
        }
    }
}
