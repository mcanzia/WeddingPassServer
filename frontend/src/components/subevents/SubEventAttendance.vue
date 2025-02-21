<template>
    <div class="px-5 py-5">
        <div v-if="!loading">
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="outline" class="ml-auto">
                        {{ selectedSubEvent?.name || 'No Events Available' }}
                        <ChevronDown class="ml-2 h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem v-for="subEvent in subEvents" :key="subEvent.id" class="capitalize"
                        @click="() => { openSubEvent(subEvent) }">
                        {{ subEvent.name }}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <BarcodeModal @barcodeScanned="checkInWithBarcode" />
            <SubEventGuests :sub-event="selectedSubEvent!" :sub-event-guests="subEventGuests" v-if="selectedSubEvent" />
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
import { SubEvent } from '@/models/SubEvent';
import { SubEventService } from '@/services/SubEventService';
import SubEventGuests from '@/components/subevents/SubEventGuests.vue';
import { useRoute } from 'vue-router';
import Loader from '@/components/Loader.vue';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { GuestService } from '@/services/GuestService';
import { Guest } from '@/models/Guest';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { SuccessHandler } from '@/util/SuccessHandler';
import BarcodeModal from '@/components/barcodes/BarcodeModal.vue';

const route = useRoute();
const { goToRouteSecured, replaceRouteSecured } = useRouterHelper();

const subEvents = ref<SubEvent[]>([]);
const selectedSubEvent = ref<SubEvent | null>(null);
const loading = ref<Boolean>(false);
const subEventGuests = ref<Guest[]>([]);

onBeforeMount(async () => {
    loading.value = true;
    const subEventService = new SubEventService();
    subEvents.value = await subEventService.getAllSubEvents();

    const subEventIdFromRoute = route.query.subEvent as string;

    if (subEventIdFromRoute) {
        const subEvent = subEvents.value.find(subEvent => subEvent.id === subEventIdFromRoute);
        initializeSubEvent(subEvent);
    } else if (subEvents.value[0]) {
        selectedSubEvent.value = subEvents.value[0];
    }
    loading.value = false;
});

watch(
    () => route.query.subEvent,
    (newSubEventId, oldSubEventId) => {
        if (newSubEventId !== oldSubEventId) {
            const subEvent: SubEvent | undefined = subEvents.value.find(subEvent => subEvent.id === newSubEventId);
            initializeSubEvent(subEvent);
        }
    }
);

function initializeSubEvent(subEvent: SubEvent | undefined) {
    if (subEvent) {
        selectedSubEvent.value = subEvent;
    } else {
        selectedSubEvent.value = subEvents.value[0];
    }
}

function openSubEvent(subEvent: SubEvent) {
    selectedSubEvent.value = subEvent;
}

watch(() => selectedSubEvent.value, async (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
        const guestService = new GuestService();
        subEventGuests.value = await guestService.getGuestsForSubEvent(newVal.id!);
    }
}, { immediate: true, deep: true });

async function checkInWithBarcode(guest: Guest) {
    try {
        if (guest && guest.attendingSubEvents && selectedSubEvent.value) {
            const alreadyCheckedIn = guest.attendingSubEvents.some(subEvent => subEvent.id === selectedSubEvent.value!.id);
            if (alreadyCheckedIn) {
                SuccessHandler.showNotification(`Guest ${guest.name} is already checked in!`);
            } else {
                guest.attendingSubEvents?.push(selectedSubEvent.value);
                const guestService = new GuestService();
                await guestService.saveGuest(guest);
                const guestIndex = subEventGuests.value.findIndex(subEventGuest => subEventGuest.id === guest.id);
                if (guestIndex) {
                    subEventGuests.value[guestIndex] = guest;
                }
                SuccessHandler.showNotification(`Checked in: ${guest.name} for ${selectedSubEvent.value.name}`);
            }
        } else {
            ErrorHandler.handleCustomError('Guest not found. Please search manually.');
            return;
        }
    } catch (error: any) {
        ErrorHandler.handleCustomError('Unexpected error occurred with handling guest. Please search manually.');
    }
}

</script>