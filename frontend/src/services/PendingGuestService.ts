import { PendingGuestController } from '@/controllers/PendingGuestController';
import { Guest } from '@/models/Guest';
import { PendingGuest } from '@/models/PendingGuest';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class PendingGuestService {

    private pendingGuestController: PendingGuestController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.pendingGuestController = new PendingGuestController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
    }

    async getAllPendingGuests() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.pendingGuestController.getAllPendingGuests(userAccessToken, this.eventRole);
            const allPendingGuests = response ? response : [];
            return allPendingGuests;
        } catch (error) {
            throw error;
        }
    }

    async getPendingGuestById(pendingGuestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const pendingGuest = await this.pendingGuestController.getPendingGuestById(userAccessToken, this.eventRole, pendingGuestId);
            return pendingGuest;
        } catch (error) {
            throw error;
        }
    }

    async savePendingGuest(pendingGuest: PendingGuest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedPendingGuest = await this.pendingGuestController.savePendingGuest(userAccessToken, this.eventRole, pendingGuest);
            return updatedPendingGuest;
        } catch (error) {
            throw error;
        }
    }

    async deletePendingGuest(pendingGuestToDelete: PendingGuest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.pendingGuestController.deletePendingGuest(userAccessToken, this.eventRole, pendingGuestToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async linkGuestAccount(pendingGuest: PendingGuest, guest: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedPendingGuest = this.pendingGuestController.linkGuestAccount(userAccessToken, this.eventRole, pendingGuest, guest);
            return updatedPendingGuest;
        } catch (error) {
            throw error;
        }
    }

}