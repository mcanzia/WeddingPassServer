import { AccommodationController } from '@/controllers/AccommodationController';
import { Accommodation } from '@/models/Accommodation';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class AccommodationService {

    private accommodationController: AccommodationController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.accommodationController = new AccommodationController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
    }

    async getAllAccommodations() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.accommodationController.getAllAccommodations(userAccessToken, this.eventRole);
            const allAccommodations = response ? response : [];
            return allAccommodations;
        } catch (error) {
            throw error;
        }
    }

    async getAccommodationById(accommodationId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const accommodation = await this.accommodationController.getAccommodationById(userAccessToken, this.eventRole, accommodationId);
            return accommodation;
        } catch (error) {
            throw error;
        }
    }

    async saveAccommodation(accommodation: Accommodation) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedAccommodation = await this.accommodationController.saveAccommodation(userAccessToken, this.eventRole, accommodation);
            return updatedAccommodation;
        } catch (error) {
            throw error;
        }
    }

    async batchAddAccommodations(accommodations: Array<Accommodation>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const accommodation = await this.accommodationController.batchAddAccommodations(userAccessToken, this.eventRole, accommodations);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteAccommodation(accommodationToDelete: Accommodation) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.accommodationController.deleteAccommodation(userAccessToken, this.eventRole, accommodationToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteAccommodations(accommodations: Array<Accommodation>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.accommodationController.batchDeleteAccommodations(userAccessToken, this.eventRole, accommodations);
            return;
        } catch (error) {
            throw error;
        }
    }
}