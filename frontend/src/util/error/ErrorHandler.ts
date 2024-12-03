import { RequestType } from "@/models/RequestType";
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';

import { FirebaseError } from 'firebase/app';

export class ErrorHandler {

    static displayGenericError() {
        console.log("Error occurred. Please try again.");
    }

    static handleCustomError(errorMessage : string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(errorMessage, NotificationType.ERROR);
    }

    static handleUserAuthError<T>(user : any, error : FirebaseError) {
        const notificationStore = useNotificationStore();
        if (error.code === 'auth/email-already-in-use') {
            notificationStore.setMessage("This email is already in use. Please try a different one.", NotificationType.ERROR);
        } else if (error.message) {
            notificationStore.setMessage(error.message, NotificationType.ERROR);
        } else {
            notificationStore.setMessage("Error occurred during user authentication. Please try again.", NotificationType.ERROR);
        }

    }

    static handleGenerateInviteLinkError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error generating invite link.`, NotificationType.ERROR);
    }

    static handleProcessInviteLinkError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error processing invite.`, NotificationType.ERROR);
    }

    static handleAuthorizationError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage("You don't access to perform this action.", NotificationType.ERROR);
    }

    static handleGetAllError<T>(userAuthToken: any, itemType: string, error: Error) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error retrieving data. Please try again.`, NotificationType.ERROR);

    }

    static handleGetByIdError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error retrieving data. Please try again.`, NotificationType.ERROR);
    }

    static handleAddError<T>(userAuthToken: any, itemType: string, itemToAdd: T, error: Error) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error adding ${itemType}. Please try again.`, NotificationType.ERROR);
    }

    static handleBatchAddError<T>(userAuthToken: any, itemType: string, itemsToAdd: T[], error: Error) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error adding ${itemType}s. Please try again.`, NotificationType.ERROR);
    }

    static handleUpdateError(itemType: string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error updating ${itemType}. Please try again.`, NotificationType.ERROR);
    }

    static handleDeleteError<T>(itemType: string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error deleting ${itemType}s. Please try again.`, NotificationType.ERROR);
    }

    static handleBatchDeleteError<T>(itemType: string) {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error deleting ${itemType}s. Please try again.`, NotificationType.ERROR);
    }

    static handleGuestUploadError() {
        const notificationStore = useNotificationStore();
        notificationStore.setMessage(`Error uploading guests. Please try again.`, NotificationType.ERROR);
    }
}