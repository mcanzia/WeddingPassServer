import { GuestController } from '@/controllers/GuestController';
import { Guest } from '@/models/Guest';
import { useUserStore } from '@/stores/UserStore';

export class GuestService {

    private guestController : GuestController;
    private userStore : any;

    constructor() {
        this.guestController = new GuestController();
        this.userStore = useUserStore();
    }

    async getAllGuests() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.guestController.getAllGuests(userAccessToken);
            const allGuests = response ? response : [];
            return allGuests;
        } catch (error) {
            throw error;
        }
    }

    async getGuestById(guestId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestById(userAccessToken, guestId);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsForEvent(eventId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestsForEvent(userAccessToken, eventId);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async addGuest(guestToAdd: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.addGuest(userAccessToken, guestToAdd);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddGuests(guests : Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.batchAddGuests(userAccessToken, guests);
            return;   
        } catch (error) {
            throw error;
        }
    }

    async updateGuest(guest : Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.updateGuest(userAccessToken, guest);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteGuest(guestToDelete: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.deleteGuest(userAccessToken, guestToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteGuests(guests : Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.batchDeleteGuests(userAccessToken, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async guestFileUpload(guestFile : File) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guestValidation = await this.guestController.guestFileUpload(userAccessToken, guestFile);
            return {...guestValidation, uploadIssues: new Map(Object.entries(guestValidation.uploadIssues))};
        } catch (error) {
            throw error;
        }
    }
}