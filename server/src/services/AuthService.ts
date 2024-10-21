import { firebaseAdmin } from "../configs/firebase";
import { AuthorizationError } from "../util/error/CustomError";
export class AuthServiceImpl {

    static async validateAuthToken(bearer : any) {
        if (!bearer || !bearer.startsWith("Bearer ")) {
            throw new AuthorizationError("Error occurred while attempting to authorize user.");
        }
        const [_, userAuthToken] = bearer.trim().split(" ");
        if (!userAuthToken) {
            throw new AuthorizationError("Error occurred while attempting to authorize user.");
        }
        try {
            const userDetails = await firebaseAdmin.auth().verifyIdToken(userAuthToken);
            return userDetails;
        } catch (error) {
            throw new AuthorizationError("User is not authorized: " + error);
        }
    }
}