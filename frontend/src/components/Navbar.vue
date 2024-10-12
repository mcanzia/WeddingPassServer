<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
        <a href="/" class="text-sm font-medium transition-colors hover:text-primary">
          Home
        </a>
        <a href="/guests" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Guest List
        </a>
        <a href="/event-attendance" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          Event Attendance
        </a>
        <a @click="logout"
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
          Logout
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/UserStore';

const userStore = useUserStore();

function goHome() {
  console.log('HIHIH');
}

async function logout() {
  await userStore.logoutUser();
}

</script>

<style scoped></style>