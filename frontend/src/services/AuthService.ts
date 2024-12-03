import { AuthController } from '@/controllers/AuthController';
import { InviteToken } from '@/models/InviteToken';
import { User } from '@/models/User';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class AuthService {

    private authController: AuthController;
    private userStore: any;
    private weddingRole: WeddingRole;

    constructor() {
        this.authController = new AuthController();
        this.userStore = useUserStore();
        this.weddingRole = this.userStore.selectedWeddingRole;
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

    async getUserById(uid: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const user = await this.authController.getUserById(userAccessToken, uid);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByPhone(phone: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const user = await this.authController.getUserByPhone(userAccessToken, phone);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserByEmail(email: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const user = await this.authController.getUserByEmail(userAccessToken, email);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getUserRoles(userId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const roles = await this.authController.getUserRoles(userAccessToken, userId);
            return roles;
        } catch (error) {
            throw error;
        }
    }

    async setUserRole(userId: string, role: WeddingRole) {
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

    async updateUser(user: User) {
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

    async generateInviteLink(newWeddingRole: WeddingRole) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const inviteLink = await this.authController.generateInviteLink(userAccessToken, newWeddingRole, this.weddingRole);
            return inviteLink;
        } catch (error) {
            throw error;
        }
    }

    async processInvite(token: InviteToken) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const weddingRole = await this.authController.processInvite(userAccessToken, token);
            return weddingRole;
        } catch (error) {
            throw error;
        }
    }

    async addUserToWedding(weddingRole: WeddingRole) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.addUserToWedding(userAccessToken, weddingRole);
            return;
        } catch (error) {
            throw error;
        }
    }

}