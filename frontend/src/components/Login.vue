<template>
  <div class="flex-1 content-center justify-center h-screen w-screen">
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-2xl">
          {{ loginRegisterText }}
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="loginForm.email"
              required
              ref="emailInputRef"
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
              <a
                @click="passwordResetEmail"
                class="ml-auto inline-block text-sm underline cursor-pointer"
                v-if="!newUser"
              >
                Forgot your password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              v-model="loginForm.password"
              required
              ref="passwordInputRef"
            />
          </div>
          <div
            class="grid gap-2"
            v-if="newUser"
          >
            <Label for="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              v-model="loginForm.confirmPassword"
              required
              ref="confirmPasswordInputRef"
            />
          </div>
          <Button
            type="submit"
            @click="signInOrCreateUser"
            class="w-full"
          >
            {{ loginRegisterText }}
          </Button>
          <Button
            variant="outline"
            class="w-full"
            @click="googleSignIn"
          >
            Login with Google
          </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          {{ haveAccountText }}
          <a
            @click="toggleNewUser"
            class="underline cursor-pointer"
          >
            {{ signInText }}
          </a>
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
import { ref, computed, watch } from "vue";

const { registerUser, loginUser, loginUserGoogle, sendPasswordResetEmail } =
  useUserStore();

const newUser = ref(false);
const loading = ref(false);
const errorMessage = ref<string | null>(null);

const loginForm = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const emailInputRef = ref<{ inputRef: HTMLInputElement | null } | null>(null);
const passwordInputRef = ref<{ inputRef: HTMLInputElement | null } | null>(
  null
);
const confirmPasswordInputRef = ref<{
  inputRef: HTMLInputElement | null;
} | null>(null);

const signInText = computed(() => {
  return newUser.value ? "Sign in" : "Sign up";
});

const haveAccountText = computed(() => {
  return newUser.value ? "Already have an account?" : "Don't have an account?";
});

const loginRegisterText = computed(() => {
  return newUser.value ? "Register" : "Login";
});

const userStore = useUserStore();
const { isLoggedIn, isAuthReady } = storeToRefs(userStore);
const { goToRouteSecured } = useRouterHelper();

watch([isLoggedIn, isAuthReady], ([newIsLoggedIn, newIsAuthReady]) => {
  if (newIsLoggedIn && newIsAuthReady) {
    goToRouteSecured("home");
  }
});

async function signInOrCreateUser() {
  loading.value = true;
  errorMessage.value = "";
  try {
    if (newUser.value) {
      if (validateRegistrationForm()) {
        registerUser(loginForm.value.email, loginForm.value.password);
      }
    } else {
      if (validateLoginForm()) {
        loginUser(loginForm.value.email, loginForm.value.password);
      }
    }
  } catch (error: any) {
    errorMessage.value = error.message;
  }

  loading.value = false;
}

async function googleSignIn() {
  errorMessage.value = "";
  try {
    await loginUserGoogle();
  } catch (error: any) {
    errorMessage.value = error.message;
  }
}

function toggleNewUser() {
  newUser.value = !newUser.value;
}

function passwordResetEmail() {
  if (validateEmailField()) {
    sendPasswordResetEmail(loginForm.value.email);
  }
}

function validateLoginForm() {
  return validateEmailField() && validatePasswordField();
}

function validateRegistrationForm() {
  return (
    validateEmailField() &&
    validatePasswordField() &&
    validateConfirmPasswordField()
  );
}

function validateEmailField() {
  if (loginForm.value.email === null || loginForm.value.email === "") {
    setWarningMessage(emailInputRef.value?.inputRef, "Email field is required");
    return false;
  }
  let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!regex.test(loginForm.value.email)) {
    setWarningMessage(
      emailInputRef.value?.inputRef,
      "Email field is improper format"
    );
    return false;
  }
  return true;
}

function validatePasswordField() {
  if (loginForm.value.password === null || loginForm.value.password === "") {
    setWarningMessage(
      passwordInputRef.value?.inputRef,
      "Password field is required"
    );
    return false;
  }
  if (loginForm.value.password.length < 6) {
    setWarningMessage(
      passwordInputRef.value?.inputRef,
      "Password must be longer than 6 characters"
    );
    return false;
  }
  return true;
}

function validateConfirmPasswordField() {
  if (
    loginForm.value.confirmPassword === null ||
    loginForm.value.confirmPassword === ""
  ) {
    setWarningMessage(
      confirmPasswordInputRef.value?.inputRef,
      "Confirm password field is required"
    );
    return false;
  }
  if (loginForm.value.confirmPassword.length < 6) {
    setWarningMessage(
      confirmPasswordInputRef.value?.inputRef,
      "Password must be longer than 6 characters"
    );
    return false;
  }
  if (loginForm.value.confirmPassword !== loginForm.value.password) {
    setWarningMessage(
      confirmPasswordInputRef.value?.inputRef,
      "Passwords must match"
    );
    return false;
  }
  return true;
}

function setWarningMessage(refTarget: any, message: string) {
  refTarget.setCustomValidity(message);
  refTarget.reportValidity();
  setTimeout(() => {
    refTarget.setCustomValidity("");
  }, 2000);
}
</script>