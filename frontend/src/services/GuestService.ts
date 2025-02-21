import { GuestController } from '@/controllers/GuestController';
import { Guest } from '@/models/Guest';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class GuestService {

    private guestController: GuestController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.guestController = new GuestController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
    }

    async getAllGuests() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.guestController.getAllGuests(userAccessToken, this.eventRole);
            const allGuests = response ? response : [];
            return allGuests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestById(guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestById(userAccessToken, this.eventRole, guestId);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async fetchPartyMembers(guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.fetchPartyMembers(userAccessToken, this.eventRole, guestId);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsForSubEvent(subEventId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.getGuestsForSubEvent(userAccessToken, this.eventRole, subEventId);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsByPhone(guestPhone: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.getGuestsByPhone(userAccessToken, this.eventRole, guestPhone);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsByEmail(guestEmail: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guests = await this.guestController.getGuestsByEmail(userAccessToken, this.eventRole, guestEmail);
            return guests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestBySerialNumber(serialNumber: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestBySerialNumber(userAccessToken, this.eventRole, serialNumber);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async saveGuest(guestToSave: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.saveGuest(userAccessToken, this.eventRole, guestToSave);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddGuests(guests: Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.batchAddGuests(userAccessToken, this.eventRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchUpdateGuests(guests: Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.batchUpdateGuests(userAccessToken, this.eventRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteGuest(guestToDelete: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.deleteGuest(userAccessToken, this.eventRole, guestToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteGuests(guests: Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.batchDeleteGuests(userAccessToken, this.eventRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async guestFileUpload(guestFile: File) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guestValidation = await this.guestController.guestFileUpload(userAccessToken, this.eventRole, guestFile);
            return { ...guestValidation, uploadIssues: new Map(Object.entries(guestValidation.uploadIssues)) };
        } catch (error) {
            throw error;
        }
    }

    async guestFileDownload() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.guestFileDownload(userAccessToken, this.eventRole);
        } catch (error) {
            throw error;
        }
    }

}