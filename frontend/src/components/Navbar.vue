<template>
  <div class="border-b w-screen">
    <div class="flex h-16 w-screen items-center px-4">
      <nav class="flex justify-between w-screen space-x-4 lg:space-x-6">
        <div :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
          <a @click="selectedWedding ? goToRouteSecured('guests') : goToRoute('landing')" class="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
            <img src="@/assets/logo.svg" alt="Home Image" class="w-11 h-8" />
          </a>
          <a @click="goToRouteSecured('guests')" v-if="selectedWedding" class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
            Guest List
          </a>
          <a @click="goToRouteSecured('event-attendance')" v-if="selectedWedding"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
            Event Attendance
          </a>
          <a @click="goToRouteSecured('guests-upload')" v-if="selectedWedding && hasEditAuthority" class=" text-sm font-medium hidden md:flex text-muted-foreground transition-colors hover:text-primary
            cursor-pointer">
            Guests Upload
          </a>
        </div>

        <IconDropdown icon="person-circle-outline" :extra-text="userEmail" classes="hidden md:flex">
          <DropdownMenuItem class="capitalize" v-if="selectedWedding" @click="goToRoute('weddings')">
            <a
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              {{ selectedWedding.name }}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" v-if="selectedWedding && hasEditAuthority" @click="goToRouteSecured('invite-user')">
            <a
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Invite Users
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" @click="logout">
            <a
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </IconDropdown>
        <IconDropdown icon="menu" classes="block md:hidden">
          <DropdownMenuItem class="capitalize" v-if="selectedWedding" @click="goToRoute('weddings')">
            <a
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              {{ selectedWedding.name }}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" v-if="selectedWedding && hasEditAuthority" @click="goToRouteSecured('guests-upload')">
            <a
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Guests Upload
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" v-if="selectedWedding && hasEditAuthority" @click="goToRouteSecured('invite-user')">
            <a
              class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Invite Users
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" @click="logout">
            <a
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
import {useRouterHelper} from '@/util/composables/useRouterHelper';

const {goToRoute, goToRouteSecured} = useRouterHelper(); 

const userStore = useUserStore();
const {userEmail, hasEditAuthority, selectedWedding} = storeToRefs(userStore);

async function logout() {
  await userStore.logoutUser();
}

</script>

<style scoped></style>