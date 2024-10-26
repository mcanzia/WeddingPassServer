import { AuthController } from '@/controllers/AuthController';
import { User } from '@/models/User';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class AuthService {

    private authController : AuthController;
    private userStore : any;

    constructor() {
        this.authController = new AuthController();
        this.userStore = useUserStore();
    }

    async getAllUsers() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.authController.getAllUsers(userAccessToken);
            const allUsers = response ? response : [];
            return allUsers;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(uid : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const user = await this.authController.getUserById(userAccessToken, uid);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserRoles(userId : string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const roles = await this.authController.getUserRoles(userAccessToken, userId);
            return roles;
        } catch (error) {
            throw error;
        }
    }
    
    async setUserRole(userId : string, role: WeddingRole) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.setUserRole(userAccessToken, userId, role);
            return;
        } catch (error) {
            throw error;
        }
    }

    async addUser(userToAdd: User) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const user = await this.authController.addUser(userAccessToken, userToAdd);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(user : User) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.updateUser(userAccessToken, user);
            return;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userToDelete: User) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.deleteUser(userAccessToken, userToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

}