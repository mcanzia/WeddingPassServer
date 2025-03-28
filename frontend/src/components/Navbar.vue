<template>
  <div class="border-none w-screen">
    <div class="flex h-16 w-screen items-center px-4">
      <nav class="flex justify-between w-screen space-x-4 lg:space-x-6" v-if="!hasNoRoles">
        <div :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
          <a @click="selectedEvent ? goToRouteSecured('home') : goToRoute('landing')"
            class="text-sm font-medium transition-colors hover:text-primary cursor-pointer">
            <img src="/images/black-logo.svg" alt="Home Image" class="w-16  h-11" />
          </a>
          <a v-for="route in filteredNavbarRoutes" :key="route"
            @click="route.secured ? goToRouteSecured(route.path) : goToRoute(route.path)"
            class="text-sm font-medium text-primary transition-colors  hover:underline hover:font-bold cursor-pointer hidden md:flex">
            {{ route.name }}
          </a>
        </div>

        <IconDropdown icon="person-circle-outline" :extra-text="userEmail" classes="hidden md:flex">
          <DropdownMenuItem class="capitalize" v-if="selectedEvent && !isGuest" @click="goToRoute('events')">
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              <span>
                <ion-icon name="sparkles-outline"></ion-icon>
                {{ selectedEvent.name }}
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" @click="logout">
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </IconDropdown>
        <IconDropdown icon="menu" classes="block md:hidden">
          <DropdownMenuItem class="capitalize" v-if="selectedEvent && !isGuest" @click="goToRoute('events')">
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              <span>
                <ion-icon name="sparkles-outline"></ion-icon>
                {{ selectedEvent.name }}
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem v-for="route in filteredNavbarRoutes" :key="route" class="capitalize"
            @click="route.secured ? goToRouteSecured(route.path) : goToRoute(route.path)">
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              {{ route.name }}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem class="capitalize" @click="logout">
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </IconDropdown>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/UserStore";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import IconDropdown from "@/components/common/IconDropdown.vue";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { computed } from "vue";
import { Roles } from "@/models/Roles";

const { goToRoute, goToRouteSecured } = useRouterHelper();

const userStore = useUserStore();
const { userEmail, selectedEvent, selectedRole, isGuest, hasNoRoles } = storeToRefs(userStore);

async function logout() {
  await userStore.logoutUser();
}

function showRoute(route) {
  if (route.secured) {
    return (
      selectedEvent.value &&
      selectedRole.value &&
      route.roles.includes(selectedRole.value)
    );
  }
  return true;
}

const navbarRoutes = computed(() => {
  return [
    {
      name: "Guest List",
      secured: true,
      path: "guests",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY, Roles.TRIO],
    },
    {
      name: "Event Attendance",
      secured: true,
      path: "sub-event-attendance",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY, Roles.TRIO],
    },
    {
      name: "Guests Upload",
      secured: true,
      path: "guests-upload",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.TRIO],
    },
    {
      name: "Surveys",
      secured: true,
      path: "surveys",
      roles: [Roles.ADMIN, Roles.EDITOR],
    },
    {
      name: "Pending Guests",
      secured: true,
      path: "pending-guests",
      roles: [Roles.ADMIN, Roles.EDITOR],
    },
    {
      name: "Accommodations",
      secured: true,
      path: "accommodations",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY],
    },
    {
      name: "Sub Events",
      secured: true,
      path: "sub-events",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY],
    },
    {
      name: "Barcodes",
      secured: true,
      path: "barcode",
      roles: [Roles.ADMIN, Roles.EDITOR],
    },
    {
      name: "Drinks",
      secured: true,
      path: "drinks",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY, Roles.TRIO],
    },
    {
      name: "Invite Users",
      secured: true,
      path: "invite-user",
      roles: [Roles.ADMIN],
    },
    {
      name: "Home",
      secured: true,
      path: "home",
      roles: [Roles.GUEST],
    },
    {
      name: "Guest Details",
      secured: true,
      path: "guest-details",
      roles: [Roles.GUEST],
    },
    {
      name: "Surveys",
      secured: true,
      path: "guest-surveys",
      roles: [Roles.GUEST],
    },
    {
      name: "Events",
      secured: true,
      path: "guest-events",
      roles: [Roles.GUEST],
    },
    {
      name: "Q&A",
      secured: true,
      path: "q-and-a",
      roles: [Roles.GUEST],
    },
    {
      name: "Things To Do",
      secured: true,
      path: "things-to-do",
      roles: [Roles.GUEST],
    },
  ];
});

const filteredNavbarRoutes = computed(() => {
  return navbarRoutes.value.filter((route) => showRoute(route));
});
</script>

<style scoped></style>