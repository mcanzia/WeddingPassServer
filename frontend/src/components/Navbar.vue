<template>
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <nav :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
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
        <a href="/guests-upload"
          class="text-sm font-medium hidden md:flex text-muted-foreground transition-colors hover:text-primary cursor-pointer">
          Guests Upload
        </a>
        <a @click="logout"
          class="text-sm font-medium hidden md:flex text-muted-foreground transition-colors hover:text-primary cursor-pointer">
          Logout
        </a>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" class="md:hidden">
              <ion-icon name="menu"></ion-icon>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem class="capitalize">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { cn } from '@/lib/utils';
import { useUserStore } from '@/stores/UserStore';
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const userStore = useUserStore();

async function logout() {
  await userStore.logoutUser();
}

</script>

<style scoped></style>