<template>
  <div>
    <Loader v-if="isProcessing" />
    <div v-else>
      <p v-if="error">{{ error }}</p>
      <p v-else>Processing your invitation...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/UserStore";
import { useNotificationStore } from "@/stores/NotificationStore";
import Loader from "@/components/Loader.vue";
import { AuthService } from "@/services/AuthService";
import { NotificationType } from "@/models/NotificationType";
import { InviteToken } from "@/models/InviteToken";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { storeToRefs } from "pinia";

const authService = new AuthService();
const route = useRoute();
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(useUserStore());
const { refetchLocalUser } = userStore;
const notificationStore = useNotificationStore();
const { goToRoute, replaceRoute } = useRouterHelper();

const isProcessing = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  const token = route.query.token as string;
  const isGuestInvite = !!(route.query.guest as string);

  if (!token) {
    error.value = "Invalid invite link.";
    isProcessing.value = false;
    return;
  }

  const inviteToken: InviteToken = new InviteToken(token);

  if (isLoggedIn.value) {
    await processInvite(inviteToken, isGuestInvite);
  } else {
    localStorage.setItem("inviteToken", token);
    if (isGuestInvite) {
      goToRoute("guest-login");
    } else {
      goToRoute("login");
    }
  }
});

async function processInvite(token: InviteToken, guestInvite: boolean) {
  try {
    if (guestInvite) {
      await authService.processInvite(token);
      goToRoute('verify-guest');
    } else {
      await authService.processInvite(token);
      notificationStore.setMessage(
        "You have been added to the wedding.",
        NotificationType.SUCCESS
      );
    }
  } catch (err) {
    error.value = "Failed to process invite.";
  } finally {
    isProcessing.value = false;
    await refetchLocalUser();
    replaceRoute("landing");
  }
}
</script>