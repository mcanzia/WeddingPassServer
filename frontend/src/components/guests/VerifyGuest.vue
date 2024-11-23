<template>
  <div class="flex-1 content-center justify-center h-screen w-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          Verify Guest Details
        </CardTitle>
        <CardDescription>
          Please verify the below details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="verify-guest-selection">Are you one of the below guests?</Label>
            <single-select-dropdown
              id="verify-guest-selection"
              v-model="selectedGuest"
              :select-options="guestNames"
              clearable
              @update:model-value="setGuestEmail"
            />
          </div>
          <div class="grid gap-2">
            <Label for="guest-email">{{ emailLabelComputed }}</Label>
            <Input
              id="guest-email"
              type="text"
              v-model="guestEmail"
              required
            />
          </div>
          <Button
            type="submit"
            class="w-full"
            @click="confirmGuest"
          >
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

const userStore = useUserStore();
const { selectedWeddingRole } = storeToRefs(userStore);
const { updateUserDetails } = userStore;
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const { goToRouteSecured } = useRouterHelper();

const guestEmail = ref<string>("");
const validGuests = ref<Guest[]>([]);
const selectedGuest = ref<string | undefined>(undefined);

onMounted(async () => {
  const phone = localStorage.getItem("guestPhone");
  if (phone) {
    const guestService = new GuestService();
    validGuests.value = await guestService.getGuestsByPhone(phone);
  }
});

const guestNames = computed(() => {
  return validGuests.value.map((guest) => guest.name);
});

const selectedGuestObject = computed(() => {
  return validGuests.value.find((guest) => guest.name === selectedGuest.value);
});

const emailLabelComputed = computed(() => {
  return selectedGuest.value
    ? "Is this a valid email?"
    : "Please enter your email";
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
    await updateUserDetails(selectedWeddingRole.value, guestEmail.value);
    SuccessHandler.showNotification("Welcome!");
    goToRouteSecured("home");
  }
}
</script>