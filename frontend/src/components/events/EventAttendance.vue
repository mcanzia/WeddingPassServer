<template>
    <div class="bg-background px-5 py-5">
        <div v-if="!loading">
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        {{ selectedEvent?.name || 'No Events Available' }}
                        <ChevronDown class="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem v-for="weddingEvent in weddingEvents" :key="weddingEvent.id"
                        class="capitalize" @click="() => { openEvent(weddingEvent) }">
                        {{ weddingEvent.name }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <EventGuests :wedding-event="selectedEvent!" />
        </div>
        <Loader v-else />
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-vue-next';
import { WeddingEvent } from '@/models/WeddingEvent';
import { EventService } from '@/services/EventService';
import EventGuests from '@/components/events/EventGuests.vue';
import { useRoute } from 'vue-router';
import Loader from '@/components/Loader.vue';
import {useRouterHelper} from '@/util/composables/useRouterHelper';

const route = useRoute();
const {goToRouteSecured, replaceRouteSecured} = useRouterHelper();

const weddingEvents = ref<WeddingEvent[]>([]);
const selectedEvent = ref<WeddingEvent | null>(null);
const loading = ref<Boolean>(false);

onBeforeMount(async () => {
    loading.value = true;
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();

    const eventIdFromRoute = route.query.event as string;

    if (eventIdFromRoute) {
        const event = weddingEvents.value.find(event => event.id === eventIdFromRoute);
        initializeEvent(event);
    } else {
        selectedEvent.value = weddingEvents.value[0];
        replaceRouteSecured('event-attendance', {}, { event: selectedEvent.value.id });
    }
    openEvent(weddingEvents.value[0])
    loading.value = false;
});

watch(
    () => route.query.event,
    (newEventId, oldEventId) => {
        if (newEventId !== oldEventId) {
            const event : WeddingEvent | undefined = weddingEvents.value.find(event => event.id === newEventId);
            initializeEvent(event);
        }
    }
);

function initializeEvent(event : WeddingEvent | undefined) {
    if (event) {
        selectedEvent.value = event;
    } else {
        selectedEvent.value = weddingEvents.value[0];
        replaceRouteSecured('event-attendance', {}, { event: selectedEvent.value.id });
    }
}

function openEvent(wedEvent: WeddingEvent) {
    selectedEvent.value = wedEvent;
    goToRouteSecured('event-attendance', {}, { event: wedEvent.id });
}
</script>