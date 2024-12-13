import { ErrorHandler } from "@/util/error/ErrorHandler";
import { Guest } from "@/models/Guest";
import { RequestUtil } from "@/controllers/RequestUtil";
import { ObjectType } from "@/models/ObjectType";
import { WeddingRole } from "@/models/WeddingRole";

export class GuestController {

    async getAllGuests(userAuthToken: any, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetAllError<Guest>(userAuthToken, ObjectType.GUEST, error);
            throw error;
        }
    }

    async getGuestById(userAuthToken: any, weddingRole: WeddingRole, guestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/id/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestsForEvent(userAuthToken: any, weddingRole: WeddingRole, eventId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/event/${eventId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async fetchPartyMembers(userAuthToken: any, weddingRole: WeddingRole, guestId: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/party/${guestId}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestsByPhone(userAuthToken: any, weddingRole: WeddingRole, guestPhone: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/phone/${guestPhone}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestsByEmail(userAuthToken: any, weddingRole: WeddingRole, guestEmail: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/email/${guestEmail}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async getGuestBySerialNumber(userAuthToken: any, weddingRole: WeddingRole, serialNumber: string) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/serial/${serialNumber}`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.GETRequestParams(userAuthToken, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGetByIdError();
            throw error;
        }
    }

    async saveGuest(userAuthToken: any, weddingRole: WeddingRole, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, guest, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleAddError<Guest>(userAuthToken, ObjectType.GUEST, guest, error);
            throw error;
        }
    }

    async batchAddGuests(userAuthToken: any, weddingRole: WeddingRole, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.POSTRequestParams(userAuthToken, guests, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchAddError<Guest>(userAuthToken, ObjectType.GUEST, guests, error);
            throw error;
        }
    }

    async batchUpdateGuests(userAuthToken: any, weddingRole: WeddingRole, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.PUTRequestParams(userAuthToken, guests, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchUpdateError<Guest>(userAuthToken, ObjectType.GUEST, guests, error);
            throw error;
        }
    }

    async deleteGuest(userAuthToken: any, weddingRole: WeddingRole, guest: Guest) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, guest, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleDeleteError<Guest>(ObjectType.GUEST);
            throw error;
        }
    }

    async batchDeleteGuests(userAuthToken: any, weddingRole: WeddingRole, guests: Array<Guest>) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/batch`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.DELETERequestParams(userAuthToken, guests, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleBatchDeleteError<Guest>(ObjectType.GUEST);
            throw error;
        }
    }

    async guestFileUpload(userAuthToken: any, weddingRole: WeddingRole, file: File) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/upload`;
            return await RequestUtil.apiRequest(requestUrl, RequestUtil.FileUploadRequestParams(userAuthToken, file, weddingRole.role));
        } catch (error: any) {
            ErrorHandler.handleGuestUploadError();
            throw error;
        }
    }

    async guestFileDownload(userAuthToken: any, weddingRole: WeddingRole) {
        try {
            const requestUrl = `${RequestUtil.getAPIUrl()}/api/weddings/${weddingRole.wedding.id}/guests/download`;
            const blob = await RequestUtil.csvRequest(requestUrl, RequestUtil.FileDownloadRequestParams(userAuthToken, weddingRole.role));

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
