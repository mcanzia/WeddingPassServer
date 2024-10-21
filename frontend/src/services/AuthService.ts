import { AuthController } from '@/controllers/AuthController';
import { Role } from '@/models/Role';
import { useUserStore } from '@/stores/UserStore';

export class AuthService {

    private authController : AuthController;
    private userStore : any;

    constructor() {
        this.authController = new AuthController();
        this.userStore = useUserStore();
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
    
    async setUserRole(userId : string, role: Role) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.setUserRole(userAccessToken, userId, role);
            return;
        } catch (error) {
            throw error;
        }
    }

}