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
      </nav>
      <div class="ml-auto flex items-center space-x-4">
          <Search />
      </div>
      <div>
        <a @click="logout" class="text-sm ml-4 font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">Logout</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "@/router/index";
import { cn } from '@/lib/utils';
import Search from '@/components/Search.vue';
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