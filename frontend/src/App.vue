<template>
  <div class="bg-background">
    <Toaster />
    <div v-if="isLoggedIn">
      <Navbar />
      <div class="bg-background">
        <router-view v-if="!isLoading"/>
        <div v-else>
          <Loader />
        </div>
      </div>
    </div>
    <Login v-else-if="!isLoading" />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Login from '@/components/Login.vue';
import Loader from '@/components/Loader.vue';
import { Toaster } from '@/components/ui/toast';
import { useToast } from '@/components/ui/toast/use-toast';
import { useUserStore } from '@/stores/UserStore';
import { useNotificationStore } from '@/stores/NotificationStore';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

const {isLoading, isLoggedIn} = storeToRefs(useUserStore());
const {initializeAuthListener} = useUserStore();
initializeAuthListener();

const notificationStore = useNotificationStore();
const {errorMessage, successMessage} = storeToRefs(notificationStore);
const {resetError, resetSuccess} = notificationStore;

const { toast } = useToast()

onMounted(() => {
  document.documentElement.classList.add('dark')
});

watch(errorMessage, (val) => {
  if (val) {
    toast({
        title: 'Error',
        description: val.message,
        variant: 'destructive'
      });
    resetError();
  }
});

watch(successMessage, (val) => {
  if (val) {
    toast({
        title: 'Success',
        description: val.message,
        variant: 'success'
      });
    resetSuccess();
  }
});

</script>

<style></style>