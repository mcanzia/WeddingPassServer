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

    const { goToRoute, goToRouteSecured } = useRouterHelper();

    // State
    const user = ref<any>(null);
    const localUser = ref<User | null>(null);
    const selectedWeddingRole = ref<WeddingRole | null>(null);
    const isLoading = ref<boolean>(false);
    const isAuthReady = ref<boolean>(false);
    const confirmationResult = ref<any>(null);
    const showOtp = ref<boolean>(false);

    // Getters
    const isLoggedIn = computed(() => user.value && !!localUser.value);
    const userEmail = computed(() => user.value?.email || null);
    const hasEditAuthority = computed(() => {
        const role = selectedWeddingRole.value?.role;
        return role && [Roles.ADMIN.toString(), Roles.EDITOR.toString()].includes(role);
    });
    const selectedWedding = computed(() => selectedWeddingRole.value?.wedding);
    const selectedRole = computed(() => selectedWeddingRole.value?.role);
    const loggedInGuest = computed(() => selectedWeddingRole.value?.guestId!);

    // Actions
    function initializeAuthListener() {
        isLoading.value = true;
        auth.onAuthStateChanged(async (authUser) => {
            user.value = authUser ? authUser : null;
            if (user.value) {
                await loadLocalUser();
                await checkForInviteToken();
                loadSelectedWeddingRole();
            } else {
                localUser.value = null;
            }
            setTimeout(() => {
                isLoading.value = false;
                isAuthReady.value = true;
            }, 500);
        });
    }

    async function loadLocalUser() {
        try {
            const authService = new AuthService();
            localUser.value = await authService.getUserById(user.value!.uid);
            if (!localUser.value) {
                await createLocalUser(user.value!);
            }
        } catch (error: any) {
            ErrorHandler.handleUserAuthError(user.value, error);
        }
    }

    async function getAccessToken() {
        try {
            return user.value ? await user.value.getIdToken() : null;
        } catch (error: any) {
            ErrorHandler.handleUserAuthError(user.value, error);
            return null;
        }
    }

    async function registerUser(email: string, password: string) {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(auth, email, password);
            await createLocalUser(userCredential.user);
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

    async function generateOTP(phoneNumber: string, appVerifier: any) {
        try {
            confirmationResult.value = await auth.signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            localStorage.setItem('guestPhone', phoneNumber);
            showOtp.value = true;
        } catch (error: any) {
            ErrorHandler.handleUserAuthError(user.value, error);
            throw error;
        }
    }

    async function loginWithCredential(otp: string) {
        try {
            if (confirmationResult.value) {
                const credential = auth.PhoneAuthProvider.credential(
                    confirmationResult.value.verificationId,
                    otp
                );
                await auth.signInWithCredential(auth, credential);
                // showOtp.value = false;
            } else {
                throw new Error('No confirmation result available');
            }
        } catch (error: any) {
            ErrorHandler.handleUserAuthError(user.value, error);
        }
    }

    async function logoutUser() {
        try {
            await auth.signOut();
            user.value = null;
            localUser.value = null;
            selectedWeddingRole.value = null;
            Cookies.remove('selectedWeddingRole');
            goToRoute('login');
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
        try {
            const newUser = new User(userDetails.uid, userDetails.email, []);
            const authService = new AuthService();
            localUser.value = await authService.addUser(newUser);
        } catch (error: any) {
            ErrorHandler.handleUserAuthError(user.value, error);
        }
    }

    async function checkForInviteToken() {
        const token = localStorage.getItem('inviteToken');
        const isGuest = localStorage.getItem('guest');
        if (token && localUser.value) {
            try {
                const inviteToken: InviteToken = new InviteToken(token);
                localStorage.removeItem('inviteToken');
                const authService = new AuthService();
                const userWeddingRole: WeddingRole = await authService.processInvite(inviteToken);

                // Check if wedding role already exists
                const existingWeddingRole = localUser.value.weddingRoles.some(
                    (role) => role.wedding.id === userWeddingRole.wedding.id && role.role === userWeddingRole.role
                );

                if (!existingWeddingRole) {
                    if (isGuest) {
                        selectedWeddingRole.value = userWeddingRole;
                        goToRoute('verify-guest');
                    } else {
                        await updateUserDetails(userWeddingRole);
                        await refetchLocalUser();
                        SuccessHandler.showNotification('Successfully added invitation to wedding.');
                    }
                } else {
                    console.log('User already exists, going home');
                    goToRouteSecured('home');
                }
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(user.value, error);
            }
        }
    }

    async function updateUserDetails(userWeddingRole?: WeddingRole, updatedEmail?: string) {
        if (localUser.value) {
            try {
                const weddingRole = userWeddingRole || selectedWeddingRole.value;
                if (weddingRole) {
                    // Filter out existing roles for the same wedding
                    localUser.value.weddingRoles = localUser.value.weddingRoles.filter(
                        (wRole) => wRole.wedding.id !== weddingRole.wedding.id
                    );

                    // Add new role
                    localUser.value.weddingRoles.push(weddingRole);

                    // Update email if provided
                    if (updatedEmail) {
                        localUser.value.email = updatedEmail;
                    }

                    const authService = new AuthService();
                    await authService.updateUser(localUser.value);
                }
            } catch (error: any) {
                console.error('Error updating user details:', error);
                ErrorHandler.handleUserAuthError(user.value, error);
            }
        }
    }

    async function refetchLocalUser() {
        if (user.value) {
            try {
                const authService = new AuthService();
                localUser.value = await authService.getUserById(user.value.uid);
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(user.value, error);
            }
        }
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
                    wedding,
                    parsedData.guestId
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
                date: selectedWeddingRole.value.wedding.date?.toDateString,
                location: selectedWeddingRole.value.wedding.location,
                ownerId: selectedWeddingRole.value.wedding.ownerId,
                role: selectedWeddingRole.value.role,
                guestId: selectedWeddingRole.value.guestId
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

    return {
        // State
        user,
        localUser,
        selectedWeddingRole,
        isLoading,
        isAuthReady,
        confirmationResult,
        showOtp,
        // Getters
        isLoggedIn,
        userEmail,
        hasEditAuthority,
        selectedRole,
        selectedWedding,
        loggedInGuest,
        // Actions
        initializeAuthListener,
        loadSelectedWeddingRole,
        saveSelectedWeddingRole,
        getAccessToken,
        registerUser,
        loginUser,
        loginUserGoogle,
        generateOTP,
        loginWithCredential,
        logoutUser,
        sendPasswordResetEmail,
        isMobile,
        createLocalUser,
        refetchLocalUser,
        updateUserDetails
    };
});
