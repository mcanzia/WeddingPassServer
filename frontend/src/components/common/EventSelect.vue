<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between">
                {{ modelValueComputed ? allEvents.find((event) => event.name === modelValueComputed)?.name : 'Select event...' }}

                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="p-0">
            <Command v-model="modelValueComputed">
                <CommandInput placeholder="Search event..." />
                <CommandEmpty>Event not found.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        <CommandItem v-for="event in allEvents" :key="event.id" :value="event.name"
                            @select="open = false">
                            <Check :class="cn(
                                'mr-2 h-4 w-4',
                                modelValueComputed === event.name ? 'opacity-100' : 'opacity-0',
                            )" />
                            {{ event.name }}
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { WeddingEvent } from '@/models/WeddingEvent';
import { EventService } from '@/services/EventService';
import { Check, ChevronsUpDown } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: () => ''
    }
});

const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    }
});

onMounted(async () => {
    const eventService = new EventService();
    allEvents.value = await eventService.getAllEvents();
});

const open = ref(false);
const allEvents = ref<WeddingEvent[]>([]);

</script>