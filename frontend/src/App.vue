<template>
  <div class="bg-background">
    <div v-if="userStore.isLoggedIn">
      <Navbar />
      <div class="bg-background">
        <router-view v-if="!userStore.isLoading"/>
        <div v-else>Loading...</div>
      </div>
    </div>
    <Login v-else-if="!userStore.isLoading" />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Login from '@/components/Login.vue';
import { useUserStore } from '@/stores/UserStore';
import { onMounted } from 'vue';

const userStore = useUserStore();
userStore.initalizeAuthListener();

onMounted(() => {
  document.documentElement.classList.add('dark')
});

</script>

<style></style>