import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Guest } from "@/models/Guest";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { EventRole } from "@/models/EventRole";

export class GuestController {

    async getAllGuests(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Guest>(userAuthToken, ObjectType.GUEST, error);
            throw error;
        }
    }

    async getGuestById(userAuthToken: any, eventRole: EventRole, guestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/id/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestsForSubEvent(userAuthToken: any, eventRole: EventRole, subEventId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/subevent/${subEventId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async fetchPartyMembers(userAuthToken: any, eventRole: EventRole, guestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/party/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestsByPhone(userAuthToken: any, eventRole: EventRole, guestPhone: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/phone/${guestPhone}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestsByEmail(userAuthToken: any, eventRole: EventRole, guestEmail: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/email/${guestEmail}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestBySerialNumber(userAuthToken: any, eventRole: EventRole, serialNumber: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/serial/${serialNumber}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveGuest(userAuthToken: any, eventRole: EventRole, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, guest, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Guest>(userAuthToken, ObjectType.GUEST, guest, error);
            throw error;
        }
    }

    async batchAddGuests(userAuthToken: any, eventRole: EventRole, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, guests, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Guest>(userAuthToken, ObjectType.GUEST, guests, error);
            throw error;
        }
    }

    async batchUpdateGuests(userAuthToken: any, eventRole: EventRole, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, guests, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchUpdateError<Guest>(userAuthToken, ObjectType.GUEST, guests, error);
            throw error;
        }
    }

    async deleteGuest(userAuthToken: any, eventRole: EventRole, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, guest, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Guest>(ObjectType.GUEST);
            throw error;
        }
    }

    async batchDeleteGuests(userAuthToken: any, eventRole: EventRole, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, guests, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Guest>(ObjectType.GUEST);
            throw error;
        }
    }

    async guestFileUpload(userAuthToken: any, eventRole: EventRole, file: File) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/upload`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.FileUploadRequestParams(userAuthToken, file, eventRole.role));
        } catch (error: any) {
            ErrorHandler.handleGuestUploadError();
            throw error;
        }
    }

    async guestFileDownload(userAuthToken: any, eventRole: EventRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/events/${eventRole.event.id}/guests/download`;
            const blob = await RequestUtil.csvRequest(requestUrl, RequestUtil.FileDownloadRequestParams(userAuthToken, eventRole.role));

            if (!blob) {
                return;
            }
            console.log('BLOB', blob);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'guests.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            ErrorHandler.handleGuestDownloadError();
            throw error;
        }
    }
}
