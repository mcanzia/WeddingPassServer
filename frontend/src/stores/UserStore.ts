import { defineStore } from 'pinia'
import { auth } from '@/firebase';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import { AuthService } from '@/services/AuthService';
import { Roles } from '@/models/Roles';
import { Role } from '@/models/Role';
import { toRaw } from 'vue';

interface IUserState {
  user : any,
  isLoading: boolean,
}

export const useUserStore = defineStore('userStore', {
    state: () : IUserState => ({
      user: null,
      isLoading: false,
    }),
    getters: {
      isLoggedIn: (state) => state.user !== null
    },
    actions: {
      async initalizeAuthListener() {
        this.isLoading = true;
        await auth.onAuthStateChanged(async authUser => {
          this.user = authUser ? authUser : null;
          if (this.user) {
            const authService = new AuthService();
            // const roles = this.user.reloadUserInfo.customAttributes ? JSON.parse(this.user.reloadUserInfo.customAttributes) : null;
            const roles = await authService.getUserRoles(this.user.uid);
            console.log('USER ROLES', roles);
            if (!roles || !roles.role) {
              await authService.setUserRole(this.user.uid, new Role(Roles.ADMIN));
            }
          }
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
          
        });
      },
      async getAccessToken() {
        try {
          return this.user ? await this.user.getIdToken() : null;
        } catch (error : any) {
          ErrorHandler.handleUserAuthError(this.user, error);
        }
      },
      async registerUser(email : string, password : string) {
        try {
          const registeredUser = await auth.createUserWithEmailAndPassword(auth, email, password);
          console.log(registeredUser);
        } catch (error : any) {
          ErrorHandler.handleUserAuthError(this.user, error);
        }
      },
      async loginUser(email : string, password : string) {
        try {
          await auth.signInWithEmailAndPassword(auth, email, password);
        } catch (error : any) {
          ErrorHandler.handleUserAuthError(this.user, error);
        }
      },
      async loginUserGoogle() {
        try {
          await auth.signInWithPopup(auth, new auth.GoogleAuthProvider());
        } catch (error : any) {
          ErrorHandler.handleUserAuthError(this.user, error);
        }
      },
      async logoutUser() {
        try {
          await auth.signOut();
        } catch (error : any) {
          ErrorHandler.handleUserAuthError(this.user, error);
        }
      },
      async sendPasswordResetEmail(email : string) {
        try {
          await auth.sendPasswordResetEmail(auth, email);
          SuccessHandler.showNotification("Password reset instructions sent to your email.")
        } catch (error : any) {
          ErrorHandler.handleUserAuthError(this.user, error);
        }
      },
      isMobile() {
        return screen.width <= 770 ? true : false;
      }
    }
})