import { PendingGuestController } from '@/controllers/PendingGuestController';
import { Guest } from '@/models/Guest';
import { PendingGuest } from '@/models/PendingGuest';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class PendingGuestService {

    private pendingGuestController: PendingGuestController;
    private userStore: any;
    private weddingRole: WeddingRole;

    constructor() {
        this.pendingGuestController = new PendingGuestController();
        this.userStore = useUserStore();
        this.weddingRole = this.userStore.selectedWeddingRole;
    }

    async getAllPendingGuests() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.pendingGuestController.getAllPendingGuests(userAccessToken, this.weddingRole);
            const allPendingGuests = response ? response : [];
            return allPendingGuests;
        } catch (error) {
            throw error;
        }
    }

    async getPendingGuestById(pendingGuestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const pendingGuest = await this.pendingGuestController.getPendingGuestById(userAccessToken, this.weddingRole, pendingGuestId);
            return pendingGuest;
        } catch (error) {
            throw error;
        }
    }

    async savePendingGuest(pendingGuest: PendingGuest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedPendingGuest = await this.pendingGuestController.savePendingGuest(userAccessToken, this.weddingRole, pendingGuest);
            return updatedPendingGuest;
        } catch (error) {
            throw error;
        }
    }

    async deletePendingGuest(pendingGuestToDelete: PendingGuest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.pendingGuestController.deletePendingGuest(userAccessToken, this.weddingRole, pendingGuestToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async linkGuestAccount(pendingGuest: PendingGuest, guest: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedPendingGuest = this.pendingGuestController.linkGuestAccount(userAccessToken, this.weddingRole, pendingGuest, guest);
            return updatedPendingGuest;
        } catch (error) {
            throw error;
        }
    }

}