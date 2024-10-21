import { RequestType } from "@/models/RequestType";
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';

import { FirebaseError } from 'firebase/app';

export class ErrorHandler {

    static displayGenericError() {
        console.log("Error occurred. Please try again.");
    }

    static handleUserAuthError<T>(user : any, error : FirebaseError) {
        const notificationStore = useNotificationStore();
        if (error.code === 'auth/email-already-in-use') {
            notificationStore.setMessage("This email is already in use. Please try a different one.", NotificationType.ERROR);
        } else {
            notificationStore.setMessage("Error occurred during user authentication. Please try again.", NotificationType.ERROR);
        }

    }
    
    static handleGetAllError<T>(userAuthToken : any, itemType : string, error : Error) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error retrieving data. Please try again.`, NotificationType.ERROR);
        
    }

    static handleGetByIdError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error retrieving data. Please try again.`, NotificationType.ERROR);
    }

    static handleAddError<T>(userAuthToken : any, itemType : string, itemToAdd : T, error : Error) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error adding ${itemType}. Please try again.`, NotificationType.ERROR);
    }

    static handleBatchAddError<T>(userAuthToken : any, itemType : string, itemsToAdd : T[], error : Error) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error adding ${itemType}s. Please try again.`, NotificationType.ERROR);
    }

    static handleUpdateError(itemType : string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error updating ${itemType}. Please try again.`, NotificationType.ERROR);
    }

    static handleDeleteError<T>(itemType : string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error deleting ${itemType}s. Please try again.`, NotificationType.ERROR);
    }

    static handleBatchDeleteError<T>(itemType : string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error deleting ${itemType}s. Please try again.`, NotificationType.ERROR);
    }

    static handleGuestUploadError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error uploading guests. Please try again.`, NotificationType.ERROR);
    }
}