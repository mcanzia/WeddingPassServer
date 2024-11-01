<!-- App.vue -->
<template>
  <div class="bg-background">
    <Toaster />
    <div v-if="isLoading">
      <Loader />
    </div>
    <div v-else>
      <Navbar v-if="isLoggedIn" />
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Loader from '@/components/Loader.vue';
import { Toaster } from '@/components/ui/toast';
import { useToast } from '@/components/ui/toast/use-toast';
import { useUserStore } from '@/stores/UserStore';
import { useNotificationStore } from '@/stores/NotificationStore';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { isLoading, isLoggedIn } = storeToRefs(userStore);
userStore.initializeAuthListener(); // Ensure the auth listener is initialized

const notificationStore = useNotificationStore();
const { errorMessage, successMessage } = storeToRefs(notificationStore);
const { resetError, resetSuccess } = notificationStore;

const { toast } = useToast();

onMounted(() => {
  document.documentElement.classList.add('dark');
});

watch(errorMessage, (val) => {
  if (val) {
    toast({
      title: 'Error',
      description: val.message,
      variant: 'destructive',
    });
    resetError();
  }
});

watch(successMessage, (val) => {
  if (val) {
    toast({
      title: 'Success',
      description: val.message,
      variant: 'success',
    });
    resetSuccess();
  }
});
</script>

<style></style>
