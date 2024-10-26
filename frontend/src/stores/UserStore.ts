import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { auth } from '@/firebase';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import { AuthService } from '@/services/AuthService';
import { Roles } from '@/models/Roles';
import { WeddingRole } from '@/models/WeddingRole';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import Cookies from 'js-cookie';

export const useUserStore = defineStore('userStore', () => {
  // State
  const user = ref<any>(null);
  const localUser = ref<User | null>(null);
  const selectedWedding = ref<Wedding | null>(null);
  const isLoading = ref<boolean>(false);
  const isAuthReady = ref<boolean>(false);

  // Getters
  const isLoggedIn = computed(() => user.value);
  const userEmail = computed(() => user.value?.email || null);
  const hasEditAuthority = computed(() => {
    return true;
    // return [Roles.ADMIN, Roles.EDITOR].includes(localUser.value?.role);
  });

  // Actions
  function initializeAuthListener() {
    isLoading.value = true;
    auth.onAuthStateChanged(async (authUser) => {
      user.value = authUser ? authUser : null;
      if (user.value) {
        const authService = new AuthService();
        localUser.value = await authService.getUserById(user.value.uid);
        if (!localUser.value) {
            await createLocalUser(user.value);
        }
        loadSelectedWedding();
        isAuthReady.value = true;
      }
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    });
  }

  function loadSelectedWedding() {
    const weddingData = Cookies.get('selectedWedding');
    if (weddingData) {
      try {
        const parsedData = JSON.parse(weddingData);
        selectedWedding.value = new Wedding(
          parsedData.id,
          parsedData.name,
          new Date(parsedData.date),
          parsedData.location,
          parsedData.ownerId
        );
      } catch (error) {
        console.error('Failed to parse selectedWedding from cookie:', error);
        selectedWedding.value = null;
      }
    }
  }

  function saveSelectedWedding() {
    if (selectedWedding.value) {
      const dataToStore = {
        id: selectedWedding.value.id,
        name: selectedWedding.value.name,
        date: selectedWedding.value.date.toDateString,
        location: selectedWedding.value.location,
        ownerId: selectedWedding.value.ownerId,
      };
      Cookies.set('selectedWedding', JSON.stringify(dataToStore), { expires: 7 });
    } else {
      Cookies.remove('selectedWedding');
    }
  }

  watch(
    selectedWedding,
    () => {
      saveSelectedWedding();
    },
    { deep: true }
  );

  async function getAccessToken() {
    try {
      return user.value ? await user.value.getIdToken() : null;
    } catch (error: any) {
      ErrorHandler.handleUserAuthError(user.value, error);
    }
  }

  async function registerUser(email: string, password: string) {
    try {
      const userDetails = await auth.createUserWithEmailAndPassword(auth, email, password);
      await createLocalUser(userDetails.user);
    } catch (error: any) {
      ErrorHandler.handleUserAuthError(user.value, error);
    }
  }

  async function loginUser(email: string, password: string) {
    try {
      await auth.signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      ErrorHandler.handleUserAuthError(user.value, error);
    }
  }

  async function loginUserGoogle() {
    try {
      const provider = new auth.GoogleAuthProvider();
      await auth.signInWithPopup(auth, provider);
    } catch (error: any) {
      ErrorHandler.handleUserAuthError(user.value, error);
    }
  }

  async function logoutUser() {
    try {
      await auth.signOut();
      user.value = null;
      localUser.value = null;
      selectedWedding.value = null;
      Cookies.remove('selectedWedding');
    } catch (error: any) {
      ErrorHandler.handleUserAuthError(user.value, error);
    }
  }

  async function sendPasswordResetEmail(email: string) {
    try {
      await auth.sendPasswordResetEmail(auth, email);
      SuccessHandler.showNotification('Password reset instructions sent to your email.');
    } catch (error: any) {
      ErrorHandler.handleUserAuthError(user.value, error);
    }
  }

  function isMobile() {
    return screen.width <= 770;
  }

  async function createLocalUser(userDetails: any) {
    const testWedding: Wedding = new Wedding(
      '6kREtT3iJIhMSLgMIitJ',
      'TEST WEDDING',
      new Date('2025-07-17T00:00:00.000Z'),
      'Vegas',
      'mkjDzyaqZtg1lpGhg0EGcHnfvS42'
    );
    const weddingRoles: Array<WeddingRole> = [new WeddingRole(Roles.EDITOR, testWedding)];
    const newUser: User = new User(userDetails.uid, userDetails.email, weddingRoles);
    const authService = new AuthService();
    localUser.value = await authService.addUser(newUser);
  }

  return {
    // State
    user,
    localUser,
    selectedWedding,
    isLoading,
    isAuthReady,
    // Getters
    isLoggedIn,
    userEmail,
    hasEditAuthority,
    // Actions
    initializeAuthListener,
    loadSelectedWedding,
    saveSelectedWedding,
    getAccessToken,
    registerUser,
    loginUser,
    loginUserGoogle,
    logoutUser,
    sendPasswordResetEmail,
    isMobile,
    createLocalUser,
  };
});
