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
            const allGuests = response ? JSON.parse(response) : [];
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

    async addGuests(guests : Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.addGuests(userAccessToken, guests);
            return guest;   
        } catch (error) {
            throw error;
        }
    }

    async deleteGuests(guests : Array<Guest>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const guest = await this.guestController.deleteGuests(userAccessToken, guests);
            return guest;
        } catch (error) {
            throw error;
        }
    }
}