import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { auth } from '@/firebase';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { AuthService } from '@/services/AuthService';
import { WeddingRole } from '@/models/WeddingRole';
import { User } from '@/models/User';
import { Wedding } from '@/models/Wedding';
import Cookies from 'js-cookie';
import { InviteToken } from '@/models/InviteToken';
import { Roles } from '@/models/Roles';

export const useUserStore = defineStore('userStore', () => {

    const { goToRoute } = useRouterHelper();

    // State
    const user = ref<any>(null);
    const localUser = ref<User | null>(null);
    const selectedWeddingRole = ref<WeddingRole | null>(null);
    const isLoading = ref<boolean>(false);
    const isAuthReady = ref<boolean>(false);

    // Getters
    const isLoggedIn = computed(() => user.value && localUser.value);
    const userEmail = computed(() => user.value?.email || null);
    const hasEditAuthority = computed(() => {
        const role = selectedWeddingRole.value?.role;
        return role && [Roles.ADMIN.toString(), Roles.EDITOR.toString()].includes(role);
    });
    const selectedWedding = computed(() => selectedWeddingRole.value?.wedding);
    const selectedRole = computed(() => selectedWeddingRole.value?.role);

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
                await checkForInviteToken();
                loadSelectedWeddingRole();
            }
            setTimeout(() => {
                isLoading.value = false;
                isAuthReady.value = true;
            }, 500);
        });
    }

    function loadSelectedWeddingRole() {
        const weddingData = Cookies.get('selectedWeddingRole');
        if (weddingData) {
            try {
                const parsedData = JSON.parse(weddingData);
                const wedding = new Wedding(
                    parsedData.id,
                    parsedData.name,
                    new Date(parsedData.date),
                    parsedData.location,
                    parsedData.ownerId
                );
                selectedWeddingRole.value = new WeddingRole(
                    parsedData.role,
                    wedding
                );
            } catch (error) {
                console.error('Failed to parse selectedWeddingRole from cookie:', error);
                selectedWeddingRole.value = null;
            }
        }
    }

    function saveSelectedWeddingRole() {
        if (selectedWeddingRole.value) {
            const dataToStore = {
                id: selectedWeddingRole.value.wedding.id,
                name: selectedWeddingRole.value.wedding.name,
                date: selectedWeddingRole.value.wedding.date.toDateString,
                location: selectedWeddingRole.value.wedding.location,
                ownerId: selectedWeddingRole.value.wedding.ownerId,
                role: selectedWeddingRole.value.role
            };
            Cookies.set('selectedWeddingRole', JSON.stringify(dataToStore), { expires: 7 });
        } else {
            Cookies.remove('selectedWeddingRole');
        }
    }

    watch(
        selectedWeddingRole,
        () => {
            saveSelectedWeddingRole();
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
            goToRoute('login');
            user.value = null;
            localUser.value = null;
            selectedWeddingRole.value = null;
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
        const newUser: User = new User(userDetails.uid, userDetails.email, []);
        const authService = new AuthService();
        localUser.value = await authService.addUser(newUser);
    }

    async function checkForInviteToken() {
        const token = localStorage.getItem('inviteToken');
        if (token) {
            const inviteToken : InviteToken = new InviteToken(token);
            localStorage.removeItem('inviteToken');
            const authService = new AuthService();
            await authService.processInvite(inviteToken);
            await refetchLocalUser();
            window.location.reload();
            setTimeout(() => {
                SuccessHandler.showNotification('Successfully added invited to wedding.');
            }, 500);  
        }
    }

    async function refetchLocalUser() {
        if (user.value && user.value.uid) {
            const authService = new AuthService();
            localUser.value = await authService.getUserById(user.value.uid);
        }
    }

    return {
        // State
        user,
        localUser,
        selectedWeddingRole,
        isLoading,
        isAuthReady,
        // Getters
        isLoggedIn,
        userEmail,
        hasEditAuthority,
        selectedRole,
        selectedWedding,
        // Actions
        initializeAuthListener,
        loadSelectedWeddingRole,
        saveSelectedWeddingRole,
        getAccessToken,
        registerUser,
        loginUser,
        loginUserGoogle,
        logoutUser,
        sendPasswordResetEmail,
        isMobile,
        createLocalUser,
        refetchLocalUser
    };
});
