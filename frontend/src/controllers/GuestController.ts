import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Guest } from "@/models/Guest";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";

export class GuestController {
    
    async getAllGuests(userAuthToken: any) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/guests`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Guest>(userAuthToken, ObjectType.GUEST, error);
        }
    }

    async getGuestById(userAuthToken: any, guestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/guests/${guestId}`;
            const response = await fetch(requestUrl, RequestUtil.GETRequestParams(userAuthToken));
            return response.json();
        } catch (error: any) {
            ErrorHandler.handleGetByIdError<Guest>(userAuthToken, ObjectType.GUEST, guestId, error);
        }
    }

    async addGuest(userAuthToken: any, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/guests`;
            await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, guest));
            return;
        } catch (error: any) {
            ErrorHandler.handleAddError<Guest>(userAuthToken, ObjectType.GUEST, guest, error);
        }
    }

    async batchAddGuests(userAuthToken: any, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/guests/batch`;
            await fetch(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, guests));
            return;
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Guest>(userAuthToken, ObjectType.GUEST, guests, error);
        }
    }

    async deleteGuest(userAuthToken: any, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/guests`;
            await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, guest));
            return;
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Guest>(ObjectType.GUEST);
        }
    }

    async batchDeleteGuests(userAuthToken: any, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/guests/batch`;
            const response = await fetch(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, guests));
            return response;
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Guest>(ObjectType.GUEST);
        }
    }
}
