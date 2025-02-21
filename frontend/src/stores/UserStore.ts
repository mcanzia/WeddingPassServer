import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { auth } from '@/firebase';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { AuthService } from '@/services/AuthService';
import { EventRole } from '@/models/EventRole';
import { User } from '@/models/User';
import { Event } from '@/models/Event';
import Cookies from 'js-cookie';
import { InviteToken } from '@/models/InviteToken';
import { Roles } from '@/models/Roles';
import { PendingGuest } from '@/models/PendingGuest';
import { PendingGuestService } from '@/services/PendingGuestService';

export const useUserStore = defineStore('userStore', () => {

    const { goToRoute, goToRouteSecured } = useRouterHelper();

    // State
    const user = ref<any>(null);
    const localUser = ref<User | null>(null);
    const selectedEventRole = ref<EventRole | null>(null);
    const isLoading = ref<boolean>(false);
    const isAuthReady = ref<boolean>(false);
    const confirmationResult = ref<any>(null);
    const showOtp = ref<boolean>(false);

    // Getters
    const isLoggedIn = computed(() => user.value && !!localUser.value);
    const userEmail = computed(() => user.value?.email || null);
    const hasEditAuthority = computed(() => {
        const role = selectedEventRole.value?.role;
        return role && [Roles.ADMIN.toString(), Roles.EDITOR.toString()].includes(role);
    });
    const selectedEvent = computed(() => selectedEventRole.value?.event);
    const selectedRole = computed(() => selectedEventRole.value?.role);
    const loggedInGuest = computed(() => selectedEventRole.value?.guestId!);
    const isGuest = computed(() => {
        if (selectedEventRole.value) {
            return selectedEventRole.value?.role === Roles.GUEST;
        } else {
            if (localUser.value && localUser.value.eventRoles && localUser.value.eventRoles.length) {
                const guestRole = localUser.value.eventRoles.find(role => role.role === Roles.GUEST);
                if (guestRole) {
                    return true;
                }
            }
        }
        return false;
    });

    const isTrio = computed(() => {
        if (selectedEventRole.value) {
            return selectedEventRole.value?.role === Roles.TRIO;
        } else {
            if (localUser.value && localUser.value.eventRoles && localUser.value.eventRoles.length) {
                const trioRole = localUser.value?.eventRoles.find(role => role.role === Roles.TRIO);
                if (trioRole) {
                    return true;
                }
            }
        }
        return false;
    });
    const hasNoRoles = computed(() => !localUser.value || !localUser.value.eventRoles || !localUser.value.eventRoles.length)

    // Actions
    function initializeAuthListener() {
        isLoading.value = true;
        auth.onAuthStateChanged(async (authUser) => {
            user.value = authUser ? authUser : null;
            if (user.value) {
                await loadLocalUser();
                await checkForInviteToken();
                loadSelectedEventRole();
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
                const result = await auth.signInWithCredential(auth, credential);
                const isNewUser = result._tokenResponse.isNewUser;
                const inviteToken = localStorage.getItem('inviteToken');
                if (isNewUser) {
                    if (!inviteToken) {
                        throw new Error('No invite token found. Please ask for invite link to be added to a event.');
                    }
                }
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
            selectedEventRole.value = null;
            Cookies.remove('selectedEventRole');
            goToRoute('login-router');
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
            const newUser = new User(userDetails.uid, userDetails.email, userDetails.phone, []);
            const authService = new AuthService();
            localUser.value = await authService.saveUser(newUser);
        } catch (error: any) {
            ErrorHandler.handleUserAuthError(user.value, error);
        }
    }

    async function checkForInviteToken(inviteToken: string | null = null, guestInvite: boolean | null = null) {
        const token = inviteToken || localStorage.getItem('inviteToken');
        const isGuest = guestInvite || localStorage.getItem('guestPhone');
        if (token && localUser.value) {
            try {
                const inviteToken: InviteToken = new InviteToken(token);
                localStorage.removeItem('inviteToken');
                const authService = new AuthService();
                const userEventRole: EventRole = await authService.processInvite(inviteToken);

                // Check if event role already exists
                const existingEventRole = localUser.value.eventRoles.some(
                    (role) => role.event.id === userEventRole.event.id && role.role === userEventRole.role
                );

                if (!existingEventRole) {
                    if (!!isGuest) {
                        selectedEventRole.value = userEventRole;
                        goToRoute('verify-guest');
                    } else {
                        await updateUserDetails(userEventRole);
                        await refetchLocalUser();
                        SuccessHandler.showNotification('Successfully added invitation to event.');
                        goToRoute('landing');
                        window.location.reload();
                    }
                } else {
                    console.log('User already exists, going home');
                    goToRoute('landing');
                }
            } catch (error: any) {
                ErrorHandler.handleUserAuthError(user.value, error);
            }
        }
    }

    async function updateUserDetails(userEventRole?: EventRole, updatedEmail?: string, updatedPhone?: string) {
        if (localUser.value) {
            try {
                const eventRole = userEventRole || selectedEventRole.value;
                if (eventRole) {
                    // Make sure event roles exists
                    if (!localUser.value.eventRoles) {
                        localUser.value.eventRoles = [];
                    }
                    // Filter out existing roles for the same event
                    localUser.value.eventRoles = localUser.value.eventRoles.filter(
                        (wRole) => wRole.event.id !== eventRole.event.id
                    );

                    // Add new role
                    localUser.value.eventRoles.push(eventRole);

                    // Update email if provided
                    if (updatedEmail) {
                        localUser.value.email = updatedEmail;
                    }

                    // Update phone if provided
                    if (updatedPhone) {
                        localUser.value.phone = updatedPhone;
                    }

                    const authService = new AuthService();
                    await authService.saveUser(localUser.value);
                }
            } catch (error: any) {
                console.error('Error updating user details:', error);
                ErrorHandler.handleUserAuthError(user.value, error);
            }
        }
    }

    async function addPendingGuest(pendingGuest: PendingGuest) {
        const pendingGuestService = new PendingGuestService();
        await pendingGuestService.savePendingGuest(pendingGuest);
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

    function loadSelectedEventRole() {
        const eventData = Cookies.get('selectedEventRole');
        if (eventData) {
            try {
                const parsedData = JSON.parse(eventData);
                const event = new Event(
                    parsedData.id,
                    parsedData.name,
                    new Date(parsedData.date),
                    parsedData.location,
                    parsedData.ownerId
                );
                selectedEventRole.value = new EventRole(
                    parsedData.role,
                    event,
                    parsedData.guestId
                );
            } catch (error) {
                console.error('Failed to parse selectedEventRole from cookie:', error);
                selectedEventRole.value = null;
            }
        }
    }

    function saveSelectedEventRole() {
        if (selectedEventRole.value) {
            const dataToStore = {
                id: selectedEventRole.value.event.id,
                name: selectedEventRole.value.event.name,
                date: selectedEventRole.value.event.date?.toDateString,
                location: selectedEventRole.value.event.location,
                ownerId: selectedEventRole.value.event.ownerId,
                role: selectedEventRole.value.role,
                guestId: selectedEventRole.value.guestId
            };
            Cookies.set('selectedEventRole', JSON.stringify(dataToStore), { expires: 7 });
        } else {
            Cookies.remove('selectedEventRole');
        }
    }

    watch(
        selectedEventRole,
        () => {
            saveSelectedEventRole();
        },
        { deep: true }
    );

    return {
        // State
        user,
        localUser,
        selectedEventRole,
        isLoading,
        isAuthReady,
        confirmationResult,
        showOtp,
        // Getters
        isLoggedIn,
        userEmail,
        hasEditAuthority,
        selectedRole,
        selectedEvent,
        loggedInGuest,
        isGuest,
        hasNoRoles,
        isTrio,
        // Actions
        initializeAuthListener,
        loadSelectedEventRole,
        saveSelectedEventRole,
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
        updateUserDetails,
        addPendingGuest,
        checkForInviteToken
    };
});
