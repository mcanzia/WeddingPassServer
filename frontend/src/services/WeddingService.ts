import { WeddingController } from '@/controllers/WeddingController';
import { Wedding } from '@/models/Wedding';
import { useUserStore } from '@/stores/UserStore';

export class WeddingService {

    private weddingController : WeddingController;
    private userStore : any;

    constructor() {
        this.weddingController = new WeddingController();
        this.userStore = useUserStore();
    }

    async getAllWeddings() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.weddingController.getAllWeddings(userAccessToken);
            const allWeddings = response ? response : [];
            return allWeddings;
        } catch (error) {
            throw error;
        }
    }

    async getWeddingsByOwner(ownerId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.weddingController.getWeddingsByOwner(userAccessToken, ownerId);
            const weddings = response ? response : [];
            return weddings;
        } catch (error) {
            throw error;
        }
    }

    async getWeddingById(weddingId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const wedding = await this.weddingController.getWeddingById(userAccessToken, weddingId);
            return wedding;
        } catch (error) {
            throw error;
        }
    }

    async addWedding(weddingToAdd: Wedding) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.weddingController.addWedding(userAccessToken, weddingToAdd);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchAddWeddings(weddings : Array<Wedding>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const wedding = await this.weddingController.batchAddWeddings(userAccessToken, weddings);
            return;   
        } catch (error) {
            throw error;
        }
    }

    async updateWedding(wedding : Wedding) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.weddingController.updateWedding(userAccessToken, wedding);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteWedding(weddingToDelete: Wedding) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.weddingController.deleteWedding(userAccessToken, weddingToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async batchDeleteWeddings(weddings : Array<Wedding>) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.weddingController.batchDeleteWeddings(userAccessToken, weddings);
            return;
        } catch (error) {
            throw error;
        }
    }
}