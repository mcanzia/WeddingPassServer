import { defineStore } from 'pinia'
import { CustomNotification } from '@/models/CustomNotification';
import { NotificationType } from '@/models/NotificationType';

interface INotificationState {
    errorMessage: CustomNotification | null,
    successMessage: CustomNotification | null,
}

export const useNotificationStore = defineStore('notificationStore', {
    state: (): INotificationState => ({
        errorMessage: null,
        successMessage: null
    }),
    actions: {
        setMessage(message: string, type: string, title?: string, variant?: string) {
            if (type === NotificationType.SUCCESS) {
                if (this.successMessage === null) {
                    this.successMessage = new CustomNotification(message, NotificationType.SUCCESS, title, variant);
                }
            } else {
                if (this.errorMessage === null) {
                    this.errorMessage = new CustomNotification(message, NotificationType.ERROR);
                }
            }
        },
        resetError() {
            this.errorMessage = null;
        },
        resetSuccess() {
            this.successMessage = null;
        }
    }
})