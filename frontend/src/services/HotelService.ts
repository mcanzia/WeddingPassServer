import { HotelController } from '@/controllers/HotelController';
import { Hotel } from '@/models/Hotel';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class HotelService {

    private hotelController: HotelController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.hotelController = new HotelController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
    }

    async getAllHotels() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.hotelController.getAllHotels(userAccessToken, this.eventRole);
            const allHotels = response ? response : [];
            return allHotels;
        } catch (error) {
            throw error;
        }
    }

    async getHotelById(hotelId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const hotel = await this.hotelController.getHotelById(userAccessToken, this.eventRole, hotelId);
            return hotel;
        } catch (error) {
            throw error;
        }
    }

    async saveHotel(hotel: Hotel) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedHotel = await this.hotelController.saveHotel(userAccessToken, this.eventRole, hotel);
            return updatedHotel;
        } catch (error) {
            throw error;
        }
    }

    async batchAddHotels(hotels: Array<Hotel>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const hotel = await this.hotelController.batchAddHotels(userAccessToken, this.eventRole, hotels);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteHotel(hotelToDelete: Hotel) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.hotelController.deleteHotel(userAccessToken, this.eventRole, hotelToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteHotels(hotels: Array<Hotel>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.hotelController.batchDeleteHotels(userAccessToken, this.eventRole, hotels);
            return;
        } catch (error) {
            throw error;
        }
    }
}