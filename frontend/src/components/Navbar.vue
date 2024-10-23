<template>
  <div class="border-b w-screen">
    <div class="flex h-16 w-screen items-center px-4">
      <nav class="flex justify-between w-screen space-x-4 lg:space-x-6">
        <div :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
          <a href="/" class="text-sm font-medium transition-colors hover:text-primary">
            <img src="@/assets/logo.svg" alt="Home Image" class="w-11 h-8" />
          </a>
          <a href="/guests" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Guest List
          </a>
          <a href="/event-attendance"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Event Attendance
          </a>
          <a href="/guests-upload" v-if="hasEditAuthority" class=" text-sm font-medium hidden md:flex text-muted-foreground transition-colors hover:text-primary
            cursor-pointer">
            Guests Upload
          </a>
        </div>

        <IconDropdown icon="person-circle-outline" :extra-text="userEmail" classes="hidden md:flex">
          <DropdownMenuItem class="capitalize">
            <a @click="logout"
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </IconDropdown>
        <IconDropdown icon="menu" classes="block md:hidden">
          <DropdownMenuItem class="capitalize" v-if="hasEditAuthority">
            <a href="/guests-upload"
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Guests Upload
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize">
            <a @click="logout"
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </IconDropdown>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/UserStore';
import {
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import IconDropdown from '@/components/common/IconDropdown.vue';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const {userEmail, hasEditAuthority} = storeToRefs(userStore);

async function logout() {
  await userStore.logoutUser();
}

</script>

<style scoped></style>