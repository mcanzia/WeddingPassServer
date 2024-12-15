<template>
    <div class="px-5 py-5">
        <div v-if="!loading">
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        {{ selectedEvent?.name || 'No Events Available' }}
                        <ChevronDown class="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem v-for="weddingEvent in weddingEvents" :key="weddingEvent.id" class="capitalize"
                        @click="() => { openEvent(weddingEvent) }">
                        {{ weddingEvent.name }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <BarcodeModal @barcodeScanned="incrementDrinkCount" />
            <DrinkGuestEvents :wedding-event="selectedEvent!" :event-guests="eventGuests" v-if="selectedEvent" />
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
import { useRoute } from 'vue-router';
import Loader from '@/components/Loader.vue';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { GuestService } from '@/services/GuestService';
import { Guest } from '@/models/Guest';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import BarcodeModal from '@/components/barcodes/BarcodeModal.vue';
import DrinkGuestEvents from '@/components/drinks/DrinkGuestEvents.vue';

const route = useRoute();
const { goToRouteSecured, replaceRouteSecured } = useRouterHelper();

const weddingEvents = ref<WeddingEvent[]>([]);
const selectedEvent = ref<WeddingEvent | null>(null);
const loading = ref<Boolean>(false);
const eventGuests = ref<Guest[]>([]);

onBeforeMount(async () => {
    loading.value = true;
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();

    const eventIdFromRoute = route.query.event as string;

    if (eventIdFromRoute) {
        const event = weddingEvents.value.find(event => event.id === eventIdFromRoute);
        initializeEvent(event);
    } else if (weddingEvents.value[0]) {
        selectedEvent.value = weddingEvents.value[0];
    }
    loading.value = false;
});

watch(
    () => route.query.event,
    (newEventId, oldEventId) => {
        if (newEventId !== oldEventId) {
            const event: WeddingEvent | undefined = weddingEvents.value.find(event => event.id === newEventId);
            initializeEvent(event);
        }
    }
);

function initializeEvent(event: WeddingEvent | undefined) {
    if (event) {
        selectedEvent.value = event;
    } else {
        selectedEvent.value = weddingEvents.value[0];
    }
}

function openEvent(wedEvent: WeddingEvent) {
    selectedEvent.value = wedEvent;
}

watch(() => selectedEvent.value, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
        const guestService = new GuestService();
        eventGuests.value = await guestService.getGuestsForEvent(newVal.id!);
    }
}, { immediate: true, deep: true });

async function incrementDrinkCount(guest: Guest) {
    try {
        if (guest && guest.drinks && selectedEvent.value) {
            if (!guest.drinks.numberOfDrinks) {
                guest.drinks.numberOfDrinks = 0;
            }
            guest.drinks.numberOfDrinks = Number(guest.drinks.numberOfDrinks) + 1;
            const guestService = new GuestService();
            await guestService.saveGuest(guest);
            const guestIndex = eventGuests.value.findIndex(eventGuest => eventGuest.id === guest.id);
            if (guestIndex) {
                console.log('UPDATED', guest);
                eventGuests.value[guestIndex] = guest;
            }
            SuccessHandler.showNotification(`${guest.name} has had ${guest.drinks.numberOfDrinks} drinks`);
        } else {
            ErrorHandler.handleCustomError('Guest not found');
            return;
        }
    } catch (error: any) {
        ErrorHandler.handleCustomError('Unexpected error occurred with handling guest');
    }
}

</script>