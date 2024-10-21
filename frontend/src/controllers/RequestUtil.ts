import { RequestType } from "@/models/RequestType";

export class RequestUtil {
    static getAPIUrl() {
        return import.meta.env.VITE_SERVER_API_URL ? import.meta.env.VITE_SERVER_API_URL : "http://localhost:7500";
    }

    static GETRequestParams(userAuthToken : any) {
        const bearer : string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.GET,
            headers: {
                'Authorization': bearer
            }
        }
    }

    static POSTRequestParams(userAuthToken : any, body : any) {
        const bearer : string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.POST,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    }

    static FileRequestParams(userAuthToken : any, file : File) {
        const bearer : string = 'Bearer ' + userAuthToken;

        const formData = new FormData();
        formData.append('file', file);

        return {
            method: RequestType.POST,
            headers: {
                'Authorization': bearer,
            },
            body: formData
        }
    }

    static PUTRequestParams(userAuthToken : any, body : any) {
        const bearer : string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.PUT,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    }

    static DELETERequestParams(userAuthToken : any, body : any) {
        const bearer : string = 'Bearer ' + userAuthToken;
        return {
            method: RequestType.DELETE,
            headers: {
                'Authorization': bearer,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    }
}

