<template>
  <div class="flex-1 content-center justify-center h-screen w-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          Verify Guest Details
        </CardTitle>
        <CardDescription>
          {{ verifyGuestLabelComputed }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2" v-if="guestNames.length">
            <Label for="verify-guest-selection">Are you one of the below guests?</Label>
            <single-select-dropdown id="verify-guest-selection" v-model="selectedGuest" :select-options="guestNames"
              clearable @update:model-value="setGuestEmail" />
          </div>
          <div class="grid gap-2" v-if="!guestNames.length">
            <Label for="guest-name">{{ nameLabelComputed }}</Label>
            <Input id="guest-name" type="text" v-model="guestName!" required />
          </div>
          <div class="grid gap-2" v-if="!guestNames.length || selectedGuest">
            <Label for="guest-email">{{ emailLabelComputed }}</Label>
            <Input id="guest-email" type="text" v-model="guestEmail!" required />
          </div>
          <div class="grid gap-2" v-if="!guestNames.length">
            <Label for="guest-phone">{{ phoneLabelComputed }}</Label>
            <PhoneInput disabled v-model="guestPhone!" required
              :preferred-countries="['IN', 'US', 'IT', 'GB', 'JP', 'CA']" />
          </div>
          <Button type="submit" class="w-full" @click="confirmGuest">
            Confirm
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SingleSelectDropdown from "@/components/common/SingleSelectDropdown.vue";
import { useUserStore } from "@/stores/UserStore";
import { useNotificationStore } from "@/stores/NotificationStore";
import { ref, onMounted, computed } from "vue";
import { NotificationType } from "@/models/NotificationType";
import { auth } from "@/firebase";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { GuestService } from "@/services/GuestService";
import { Guest } from "@/models/Guest";
import { WeddingRole } from "@/models/WeddingRole";
import { SuccessHandler } from "@/util/SuccessHandler";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import PhoneInput from "@/components/common/PhoneInput.vue";
import { usePhoneUtils } from "@/components/common/usePhoneUtils";
import { GuestInviteStatus } from "@/models/GuestInviteStatus";
import { PendingGuest } from "@/models/PendingGuest";

const userStore = useUserStore();
const { selectedWeddingRole, localUser } = storeToRefs(userStore);
const { updateUserDetails, addPendingGuest, logoutUser } = userStore;
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const { goToRouteSecured } = useRouterHelper();
const { maskPhone } = usePhoneUtils();

const guestName = ref<string | null>();
const guestEmail = ref<string | null>();
const guestPhone = ref<string | null>();
const validGuests = ref<Guest[]>([]);
const selectedGuest = ref<string | undefined>(undefined);

onMounted(async () => {
  guestPhone.value = localStorage.getItem("guestPhone");
  if (guestPhone.value) {
    const guestService = new GuestService();
    validGuests.value = await guestService.getGuestsByPhone(guestPhone.value);
  }
});

const guestNames = computed(() => {
  return validGuests.value.map((guest) => guest.name);
});

const selectedGuestObject = computed(() => {
  return validGuests.value.find((guest) => guest.name === selectedGuest.value);
});

const nameLabelComputed = computed(() => {
  return 'Full Guest Name';
});

const emailLabelComputed = computed(() => {
  return selectedGuest.value
    ? "Is this a valid email?"
    : "Email Address";
});

const phoneLabelComputed = computed(() => {
  return selectedGuest.value
    ? "Is this a valid phone number?"
    : "Phone Number";
});

const verifyGuestLabelComputed = computed(() => {
  if (guestNames.value.length) {
    return "Please verify the below details";
  }
  if (guestPhone.value) {
    return `No guests found matching ${maskPhone(guestPhone.value)}. Please enter the below details and an admin will add you.`;
  }
  return "No guests found matching that phone number. Please enter the below details and an admin will add you.";
});

function setGuestEmail() {
  if (selectedGuest.value) {
    guestEmail.value = selectedGuestObject.value?.email || "";
  } else {
    guestEmail.value = "";
  }
}

async function confirmGuest() {
  if (selectedGuestObject.value && guestEmail.value) {
    selectedWeddingRole.value = {
      ...selectedWeddingRole.value,
      guestId: selectedGuestObject.value.id,
    } as WeddingRole;
    await updateUserDetails(selectedWeddingRole.value, guestEmail.value, guestPhone.value!);
    localStorage.removeItem("guestPhone");
    SuccessHandler.showNotification("Welcome!");
    goToRouteSecured("home");
  } else if (!guestNames.value.length && localUser.value) {
    const pendingGuest = {
      weddingId: selectedWeddingRole.value?.wedding.id,
      userId: localUser.value.id,
      guestName: guestName.value,
      email: guestEmail.value,
      phone: guestPhone.value,
      status: GuestInviteStatus.PENDING
    } as PendingGuest;
    await addPendingGuest(pendingGuest);
    localStorage.removeItem("guestPhone");
    logoutUser();
    SuccessHandler.showNotification("Invite Requested. Please wait for admin to add you.");
  } else {
    ErrorHandler.displayGenericError();
  }
}
</script>