import { GuestController } from '@/controllers/GuestController';
import { Guest } from '@/models/Guest';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class GuestService {

    private guestController : GuestController;
    private userStore : any;
    private weddingRole : WeddingRole;

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

    async getGuestById(guestId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestById(userAccessToken, this.weddingRole, guestId);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async getGuestsForEvent(eventId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.getGuestsForEvent(userAccessToken, this.weddingRole, eventId);
            return guest;
        } catch (error) {
            throw error;
        }
    }

    async addGuest(guestToAdd: Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.addGuest(userAccessToken, this.weddingRole, guestToAdd);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddGuests(guests : Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.batchAddGuests(userAccessToken, this.weddingRole, guests);
            return;   
        } catch (error) {
            throw error;
        }
    }

    async updateGuest(guest : Guest) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.updateGuest(userAccessToken, this.weddingRole, guest);
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

    async batchDeleteGuests(guests : Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.guestController.batchDeleteGuests(userAccessToken, this.weddingRole, guests);
            return;
        } catch (error) {
            throw error;
        }
    }

    async guestFileUpload(guestFile : File) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guestValidation = await this.guestController.guestFileUpload(userAccessToken, this.weddingRole, guestFile);
            return {...guestValidation, uploadIssues: new Map(Object.entries(guestValidation.uploadIssues))};
        } catch (error) {
            throw error;
        }
    }
}