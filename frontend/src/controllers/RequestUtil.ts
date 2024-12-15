import { RequestType } from "@/models/RequestType";
import { ErrorHandler } from "@/util/error/ErrorHandler";

export class RequestUtil {
    static getAPIUrl() {
        return import.meta.env.VITE_SERVER_API_URL ? import.meta.env.VITE_SERVER_API_URL : "http://192.168.1.181:7500";
    }

    static GETRequestParams(userAuthToken: any, role?: string) {
        const bearer: string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.GET,
            headers: {
                'Authorization': bearer,
                ...(role && { 'UserRole': role }),
            }
        }
    }

    static POSTRequestParams(userAuthToken: any, body: any, role?: string) {
        const bearer: string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.POST,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json',
                ...(role && { 'UserRole': role }),
            },
            body: JSON.stringify(body)
        }
    }

    static FileUploadRequestParams(userAuthToken: any, file: File, role?: string) {
        const bearer: string = 'Bearer ' + userAuthToken;

        const formData = new FormData();
        formData.append('file', file);

        return {
            method: RequestType.POST,
            headers: {
                'Authorization': bearer,
                ...(role && { 'UserRole': role }),
            },
            body: formData
        }
    }

    static FileDownloadRequestParams(userAuthToken: any, role?: string) {
        const bearer: string = 'Bearer ' + userAuthToken;

        return {
            method: RequestType.GET,
            headers: {
                'Authorization': bearer,
                ...(role && { 'UserRole': role }),
            }
        }
    }

    static PUTRequestParams(userAuthToken: any, body: any, role?: string) {
        const bearer: string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.PUT,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json',
                ...(role && { 'UserRole': role }),
            },
            body: JSON.stringify(body)
        }
    }

    static DELETERequestParams(userAuthToken: any, body: any, role?: string) {
        const bearer: string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.DELETE,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json',
                ...(role && { 'UserRole': role }),
            },
            body: JSON.stringify(body)
        }
    }

    static async apiRequest<T>(url: string, options: RequestInit) {
        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 403) {
                ErrorHandler.handleAuthorizationError();
                return;
            } else {
                throw new Error();
            }
        }

        if (response.status === 204) {
            return null;
        }
        return await response.json();
    }

    static async csvRequest<T>(url: string, options: RequestInit) {
        const response = await fetch(url, options);

        if (!response.ok) {
            if (response.status === 403) {
                ErrorHandler.handleAuthorizationError();
                return;
            } else {
                throw new Error();
            }
        }

        if (response.status === 204) {
            return null;
        }
        return await response.blob();
    }

}

