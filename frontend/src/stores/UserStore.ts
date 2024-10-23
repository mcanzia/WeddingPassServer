import { defineStore } from 'pinia'
import { auth } from '@/firebase';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import { AuthService } from '@/services/AuthService';
import { Roles } from '@/models/Roles';
import { Role } from '@/models/Role';
import { User } from '@/models/User';

interface IUserState {
    user: any,
    userRole: any,
    isLoading: boolean,
    isAuthReady: boolean
}

export const useUserStore = defineStore('userStore', {
    state: (): IUserState => ({
        user: null,
        userRole: null,
        isLoading: false,
        isAuthReady: false
    }),
    getters: {
        isLoggedIn: (state) => state.user,
        userEmail: (state) => state.user.email || null,
        hasEditAuthority: (state) => [Roles.ADMIN, Roles.EDITOR].includes(state.userRole),
    },
    actions: {
        initalizeAuthListener() {
            this.isLoading = true;
            auth.onAuthStateChanged(async authUser => {
                this.user = authUser ? authUser : null;
                if (this.user) {
                    await this.setUserRole(this.user);
                }
                this.isAuthReady = true;
                setTimeout(() => {
                    this.isLoading = false;
                }, 500);

            });
        },
        async getAccessToken() {
            try {
                return this.user ? await this.user.getIdToken() : null;
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(this.user, error);
            }
        },
        async registerUser(email: string, password: string) {
            try {
                await auth.createUserWithEmailAndPassword(auth, email, password);
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(this.user, error);
            }
        },
        async loginUser(email: string, password: string) {
            try {
                const userCredential = await auth.signInWithEmailAndPassword(auth, email, password);
                const currentUser = userCredential.user;
                this.setUserRole(currentUser);
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(this.user, error);
            }
        },
        async loginUserGoogle() {
            try {
                const userCredential = await auth.signInWithPopup(auth, new auth.GoogleAuthProvider());
                const currentUser = userCredential.user;
                this.setUserRole(currentUser);
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(this.user, error);
            }
        },
        async logoutUser() {
            try {
                await auth.signOut();
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(this.user, error);
            }
        },
        async sendPasswordResetEmail(email: string) {
            try {
                await auth.sendPasswordResetEmail(auth, email);
                SuccessHandler.showNotification("Password reset instructions sent to your email.")
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(this.user, error);
            }
        },
        isMobile() {
            return screen.width <= 770 ? true : false;
        },
        async setUserRole(currentUser : any) {
            const idTokenResult = await currentUser.getIdTokenResult(true);
            const claims = idTokenResult.claims;
            this.userRole = claims.role || null;
        }
    }
})