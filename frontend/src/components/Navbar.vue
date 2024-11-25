<template>
  <div class="border-b w-screen">
    <div class="flex h-16 w-screen items-center px-4">
      <nav class="flex justify-between w-screen space-x-4 lg:space-x-6">
        <div :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')">
          <a
            @click="selectedWedding ? goToRouteSecured('home') : goToRoute('landing')"
            class="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
          >
            <img
              src="@/assets/logo.svg"
              alt="Home Image"
              class="w-11 h-8"
            />
          </a>
          <a
            v-for="route in filteredNavbarRoutes"
            :key="route"
            @click="route.secured ? goToRouteSecured(route.path) : goToRoute(route.path)"
            class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer hidden md:flex"
          >
            {{ route.name }}
          </a>
        </div>

        <IconDropdown
          icon="person-circle-outline"
          :extra-text="userEmail"
          classes="hidden md:flex"
        >
          <DropdownMenuItem
            class="capitalize"
            v-if="selectedWedding"
            @click="goToRoute('weddings')"
          >
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              <span>
                <ion-icon name="sparkles-outline"></ion-icon>
                {{ selectedWedding.name }}
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="capitalize"
            @click="logout"
          >
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              Logout
            </a>
          </DropdownMenuItem>
        </IconDropdown>
        <IconDropdown
          icon="menu"
          classes="block md:hidden"
        >
          <DropdownMenuItem
            class="capitalize"
            v-if="selectedWedding"
            @click="goToRoute('weddings')"
          >
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              <span>
                <ion-icon name="sparkles-outline"></ion-icon>
                {{ selectedWedding.name }}
              </span>
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            v-for="route in filteredNavbarRoutes"
            :key="route"
            class="capitalize"
            @click="route.secured ? goToRouteSecured(route.path) : goToRoute(route.path)"
          >
            <a class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary cursor-pointer">
              {{ route.name }}
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            class="capitalize"
            @click="logout"
          >
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
const { userEmail, selectedWedding, selectedRole } = storeToRefs(userStore);

async function logout() {
  await userStore.logoutUser();
}

function showRoute(route) {
  if (route.secured) {
    return (
      selectedWedding.value &&
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
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY],
    },
    {
      name: "Event Attendance",
      secured: true,
      path: "event-attendance",
      roles: [Roles.ADMIN, Roles.EDITOR, Roles.READONLY],
    },
    {
      name: "Guests Upload",
      secured: true,
      path: "guests-upload",
      roles: [Roles.ADMIN, Roles.EDITOR],
    },
    {
      name: "Surveys",
      secured: true,
      path: "surveys",
      roles: [Roles.ADMIN, Roles.EDITOR],
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
      name: "Surveys",
      secured: true,
      path: "guest-surveys",
      roles: [Roles.GUEST],
    },
    {
      name: "Events",
      secured: true,
      path: "home",
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