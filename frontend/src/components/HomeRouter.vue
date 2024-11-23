<template>
  <component :is="currentComponent" />
</template>
  
  <script setup lang="ts">
import { computed } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { storeToRefs } from "pinia";
import Home from "@/components/Home.vue";
import GuestHome from "@/components/guests/GuestHome.vue";
import Unauthorized from "@/components/Unauthorized.vue";
import { Roles } from "@/models/Roles";

const userStore = useUserStore();
const { selectedRole } = storeToRefs(userStore);

const currentComponent = computed(() => {
  if (selectedRole.value) {
    const isGuest = selectedRole.value === Roles.GUEST;
    if (isGuest) {
      return GuestHome;
    }
    return Home;
  }
  return Unauthorized;
});
</script>
  
  