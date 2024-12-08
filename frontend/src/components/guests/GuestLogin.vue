<template>
  <div class="flex-1 content-center justify-center h-screen w-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          Guest Login
        </CardTitle>
        <CardDescription>
          {{ descriptionText }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2" v-if="!showOtp">
            <Label>Phone</Label>
            <PhoneInput v-model="loginForm.phone" required
              :preferred-countries="['IN', 'US', 'IT', 'GB', 'JP', 'CA']" />
          </div>
          <div class="grid gap-2" v-else>
            <Label for="otp">Enter One Time Password</Label>
            <Input id="otp" type="number" v-model="otp" required />
          </div>
          <div id="recaptcha-container"></div>
          <Button type="submit" @click="handleSubmit" class="w-full">
            {{ submitText }}
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
import { useUserStore } from "@/stores/UserStore";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { storeToRefs } from "pinia";
import { ref, computed, watch, onMounted } from "vue";
import { useRecaptcha } from "@/components/common/useRecaptcha";
import { useNotificationStore } from "@/stores/NotificationStore";
import { NotificationType } from "@/models/NotificationType";
import PhoneInput from "@/components/common/PhoneInput.vue";

const userStore = useUserStore();
const { isLoggedIn, isAuthReady, showOtp } = storeToRefs(userStore);
const { generateOTP, loginWithCredential } = userStore;
const { goToRouteSecured, goToRoute } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const { initializeRecaptcha, recaptchaVerifier, resetRecaptcha } =
  useRecaptcha();

const loading = ref(false);

const loginForm = ref({
  phone: "",
});

onMounted(() => {
  initializeRecaptcha();
});

const phoneInputRef = ref<{ inputRef: HTMLInputElement | null } | null>(null);
const otp = ref("");

watch([isLoggedIn, isAuthReady], ([newIsLoggedIn, newIsAuthReady]) => {
  if (newIsLoggedIn && newIsAuthReady) {
    goToRouteSecured("home");
  }
});

const submitText = computed(() => {
  return showOtp.value ? "Verify" : "Sign In";
});

const descriptionText = computed(() => {
  return showOtp.value ? "A code has been sent to your phone number. Please verify it below." : "Enter your phone number below to login to your account";
})

function handleSubmit() {
  if (showOtp.value) {
    verify();
  } else {
    sendOTP();
  }
}

async function sendOTP() {
  // if (!validatePhoneField()) {
  //   return;
  // }

  try {
    await generateOTP(loginForm.value.phone, recaptchaVerifier.value);
  } catch (error) {
    setMessage("Failed to send OTP. Please try again.", NotificationType.ERROR);
    resetRecaptcha();
  }
}

function validatePhoneField() {
  const phone = loginForm.value.phone;

  if (!phone) {
    setWarningMessage(phoneInputRef.value?.inputRef, "Phone field is required");
    return false;
  }

  const regex = /^\+?[1-9]\d{1,14}$/;

  const trimmedPhone = phone.trim();

  if (!regex.test(trimmedPhone)) {
    setWarningMessage(
      phoneInputRef.value?.inputRef,
      "Phone number is in an improper format"
    );
    return false;
  }

  return true;
}

async function verify() {
  if (!otp.value) {
    setMessage("OTP is required", NotificationType.ERROR);
    return;
  }

  try {
    await loginWithCredential(otp.value);
  } catch (error) {
    console.error("Error during OTP verification", error);
    setMessage("Invalid OTP. Please try again.", NotificationType.ERROR);
  }
}

function setWarningMessage(refTarget: any, message: string) {
  refTarget.setCustomValidity(message);
  refTarget.reportValidity();
  setTimeout(() => {
    refTarget.setCustomValidity("");
  }, 2000);
}
</script>