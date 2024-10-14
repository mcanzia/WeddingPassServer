<template>
    <div class="bg-background px-5 py-5">
        <DropdownMenu>
            <DropdownMenuTrigger as-child>
                <Button variant="outline" class="ml-auto">
                    {{ selectedEvent?.name || 'No Events Available' }}
                    <ChevronDown class="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuCheckboxItem v-for="weddingEvent in weddingEvents" :key="weddingEvent.id"
                    class="capitalize" @update:checked="() => { openEvent(weddingEvent) }">
                    {{ weddingEvent.name }}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <EventGuests :wedding-event="selectedEvent!" />
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-vue-next';
import { WeddingEvent } from '@/models/WeddingEvent';
import { EventService } from '@/services/EventService';
import EventGuests from '@/components/events/EventGuests.vue';


const weddingEvents = ref<WeddingEvent[]>([]);
const selectedEvent = ref<WeddingEvent | null>(null);

onBeforeMount(async () => {
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();
    selectedEvent.value = weddingEvents.value[0];
});

function openEvent(wedEvent: WeddingEvent) {
    selectedEvent.value = wedEvent;
}
</script>