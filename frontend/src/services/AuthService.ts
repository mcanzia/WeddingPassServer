import { AuthController } from '@/controllers/AuthController';
import { InviteToken } from '@/models/InviteToken';
import { User } from '@/models/User';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class AuthService {

    private authController: AuthController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.authController = new AuthController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
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

    async setUserRole(userId: string, role: EventRole) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.setUserRole(userAccessToken, userId, role);
            return;
        } catch (error) {
            throw error;
        }
    }

    async saveUser(userToAdd: User) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const user = await this.authController.saveUser(userAccessToken, userToAdd);
            return user;
        } catch (error) {
            throw error;
        }
    }

    // async updateUser(user: User) {
    //     try {
    //         const userAccessToken = await this.userStore.getAccessToken();
    //         await this.authController.updateUser(userAccessToken, user);
    //         return;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    async deleteUser(userToDelete: User) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.deleteUser(userAccessToken, userToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

    async generateInviteLink(newEventRole: EventRole) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const inviteLink = await this.authController.generateInviteLink(userAccessToken, newEventRole, this.eventRole);
            return inviteLink;
        } catch (error) {
            throw error;
        }
    }

    async processInvite(token: InviteToken) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const eventRole = await this.authController.processInvite(userAccessToken, token);
            return eventRole;
        } catch (error) {
            throw error;
        }
    }

    async addUserToEvent(eventRole: EventRole) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.authController.addUserToEvent(userAccessToken, eventRole);
            return;
        } catch (error) {
            throw error;
        }
    }

}