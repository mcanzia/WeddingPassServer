import { defineStore } from 'pinia'
import { CustomNotification } from '@/models/CustomNotification';
import { NotificationType } from '@/models/NotificationType';

interface INotificationState {
    errorMessage : CustomNotification | null,
    successMessage : CustomNotification | null,
}

export const useNotificationStore = defineStore('notificationStore', {
    state: () : INotificationState => ({
        errorMessage: null,
        successMessage : null
      }),
    actions: {
        setMessage(message : string, type : string) {
            if (type === NotificationType.SUCCESS) {
                if (this.successMessage === null) {
                    this.successMessage = new CustomNotification(message, NotificationType.SUCCESS);
                }
            } else {
                if (this.errorMessage === null) {
                    this.errorMessage = new CustomNotification(message, NotificationType.ERROR);
                }
            }
        },
        resetMessage() {
            this.errorMessage = null;
            this.successMessage = null;
        }
    }
})