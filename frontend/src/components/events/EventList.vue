<template>
  <div class="mx-4 mt-4">
    <div class="inline-flex gap-4" v-if="!isGuest && !isTrio">
      <Search class="mb-4" placeholder="Search for event..." v-model="searchQuery" />
      <Button @click="goToAddEvent">Create Event</Button>
    </div>
    <div v-if="allEventRoles.length">
      <EventCard class="cursor-pointer" v-for="eventRole in filteredEventRoles" :event-role="eventRole"
        :key="eventRole.event.id" @click="selectEvent(eventRole)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import EventCard from "@/components/events/EventCard.vue";
import { Button } from "@/components/ui/button";
import { Event } from "@/models/Event";
import Search from "@/components/Search.vue";
import { ref, onMounted, watch, computed } from "vue";
import debounce from "lodash/debounce";
import { useUserStore } from "@/stores/UserStore";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { EventRole } from "@/models/EventRole";

const userStore = useUserStore();
const { localUser, selectedEventRole, isGuest, isTrio } = storeToRefs(userStore);

onMounted(() => {
  if (localUser.value) {
    allEventRoles.value = localUser.value.eventRoles ?? [];
  }
});

const { goToRoute, goToRouteSecured } = useRouterHelper();
const searchQuery = ref("");
const debouncedSearchQuery = ref("");
const allEventRoles = ref<EventRole[]>([]);

const filteredEventRoles = computed(() => {
  let localEventRoles = allEventRoles.value;

  if (debouncedSearchQuery.value) {
    localEventRoles = localEventRoles.filter((eventRole) =>
      eventRole.event.name
        .toLowerCase()
        .includes(debouncedSearchQuery.value.toLowerCase())
    );
  }
  return localEventRoles;
});

const updateSearchQuery = debounce((value: string) => {
  debouncedSearchQuery.value = value;
}, 250);

watch(searchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

function goToAddEvent() {
  goToRoute("add-event");
}

function goToEditEvent(eventRole: EventRole) {
  goToRoute("edit-event", { eventId: eventRole.event.id });
}

function selectEvent(eventRole: EventRole) {
  selectedEventRole.value = eventRole;
  goToRouteSecured("home");
}
</script>