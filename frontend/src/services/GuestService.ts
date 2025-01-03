import { GuestController } from '@/controllers/GuestController';
import { Guest } from '@/models/Guest';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class GuestService {

    private guestController: GuestController;
    private userStore: any;
    private weddingRole: WeddingRole;

    constructor() {
        this.guestController = new GuestController();
        this.userStore = useUserStore();
        this.weddingRole = this.userStore.selectedWeddingRole;
    }

    async getAllGuests() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.guestController.getAllGuests(userAccessToken, this.weddingRole);
            const allGuests = response ? response : [];
            return allGuests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestById(guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestById(userAccessToken, this.weddingRole, guestId);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async fetchPartyMembers(guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.fetchPartyMembers(userAccessToken, this.weddingRole, guestId);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsForEvent(eventId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.getGuestsForEvent(userAccessToken, this.weddingRole, eventId);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsByPhone(guestPhone: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.getGuestsByPhone(userAccessToken, this.weddingRole, guestPhone);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsByEmail(guestEmail: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.getGuestsByEmail(userAccessToken, this.weddingRole, guestEmail);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestBySerialNumber(serialNumber: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestBySerialNumber(userAccessToken, this.weddingRole, serialNumber);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async saveGuest(guestToSave: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.saveGuest(userAccessToken, this.weddingRole, guestToSave);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddGuests(guests: Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.batchAddGuests(userAccessToken, this.weddingRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchUpdateGuests(guests: Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.batchUpdateGuests(userAccessToken, this.weddingRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteGuest(guestToDelete: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.deleteGuest(userAccessToken, this.weddingRole, guestToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteGuests(guests: Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.batchDeleteGuests(userAccessToken, this.weddingRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async guestFileUpload(guestFile: File) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guestValidation = await this.guestController.guestFileUpload(userAccessToken, this.weddingRole, guestFile);
            return { ...guestValidation, uploadIssues: new Map(Object.entries(guestValidation.uploadIssues)) };
        } catch (error) {
            throw error;
        }
    }

    async guestFileDownload() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.guestFileDownload(userAccessToken, this.weddingRole);
        } catch (error) {
            throw error;
        }
    }

}