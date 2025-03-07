<template>
  <div>LANDING</div>
</template>

<script setup>
import { useUserStore } from "@/stores/UserStore";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";

const { goToRoute, goToRouteSecured } = useRouterHelper();

const userStore = useUserStore();
const { selectedEvent, selectedRole } = storeToRefs(userStore);

onMounted(() => {
  if (selectedEvent) {
  }
});
</script>