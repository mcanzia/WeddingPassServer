import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Hotel } from "@/models/Hotel";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";

export class HotelController {

    async getAllHotels(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/hotels`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Hotel>(userAuthToken, ObjectType.HOTEL, error);
            throw error;
        }
    }

    async getHotelById(userAuthToken: any, eventRole: EventRole, hotelId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/hotels/id/${hotelId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveHotel(userAuthToken: any, eventRole: EventRole, hotel: Hotel) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/hotels`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, hotel, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Hotel>(userAuthToken, ObjectType.HOTEL, hotel, error);
            throw error;
        }
    }

    async batchAddHotels(userAuthToken: any, eventRole: EventRole, hotels: Array<Hotel>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/hotels/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, hotels, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Hotel>(userAuthToken, ObjectType.HOTEL, hotels, error);
            throw error;
        }
    }

    async deleteHotel(userAuthToken: any, eventRole: EventRole, hotel: Hotel) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/hotels`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, hotel, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Hotel>(ObjectType.HOTEL);
            throw error;
        }
    }

    async batchDeleteHotels(userAuthToken: any, eventRole: EventRole, hotels: Array<Hotel>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/hotels/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, hotels, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Hotel>(ObjectType.HOTEL);
            throw error;
        }
    }
}
