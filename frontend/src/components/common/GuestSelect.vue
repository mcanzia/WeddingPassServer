<template>
    <Popover v-model:open="open">
        <PopoverTrigger as-child>
            <Button variant="outline" role="combobox" :aria-expanded="open" class="w-full justify-between">
                {{ modelValueComputed ? allGuests.find((guest) => guest.name === modelValueComputed)?.name : 'Select guest...' }}

                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent class="p-0">
            <Command v-model="modelValueComputed">
                <CommandInput placeholder="Search guest..." />
                <CommandEmpty>Guest not found.</CommandEmpty>
                <CommandList>
                    <CommandGroup>
                        <CommandItem v-for="guest in allGuests" :key="guest.id" :value="guest.name"
                            @select="open = false">
                            <Check :class="cn(
                                'mr-2 h-4 w-4',
                                modelValueComputed === guest.name ? 'opacity-100' : 'opacity-0',
                            )" />
                            {{ guest.name }}
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
import { Guest } from '@/models/Guest';
import { GuestService } from '@/services/GuestService';
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
    const guestService = new GuestService();
    allGuests.value = await guestService.getAllGuests();
});

const open = ref(false);
const allGuests = ref<Guest[]>([]);

</script>