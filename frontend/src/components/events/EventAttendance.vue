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
                <DropdownMenuCheckboxItem v-for="weddingEvent in weddingEvents" :key="weddingEvent.id" class="capitalize" @update:checked="() => {openEvent(weddingEvent)}">
                    {{ weddingEvent.name }}
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-vue-next';
import { WeddingEvent } from '@/models/WeddingEvent';


const weddingEvents = ref<WeddingEvent[]>([]);
const selectedEvent = ref<WeddingEvent | null>(null);

onMounted(() => {
    weddingEvents.value= [
        {
            id: '1',
            name: 'Mehendi'
        },
        {
            id: '2',
            name: 'Haldi'
        },
        {
            id: '3',
            name: 'Sangeet'
        },
        {
            id: '4',
            name: 'Morning Ceremony'
        },
        {
            id: '5',
            name: 'Evening Ceremony'
        },
    ];
    selectedEvent.value = weddingEvents.value[0];
});

function openEvent(wedEvent : WeddingEvent) {
    selectedEvent.value = wedEvent;
}
</script>