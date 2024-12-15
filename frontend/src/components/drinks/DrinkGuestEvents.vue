<template>
    <div class="flex-1 mt-5 h-screen">
        <Card class="mx-auto max-w-sm h-3/4 flex flex-col">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Drink Count For {{ eventNameComputed }}
                </CardTitle>
                <Search class="mb-4" placeholder="Search guest name..." v-model="searchQuery" />
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <div v-if="filteredGuests.length === 0">No Guests</div>
                <div v-else v-for="guest in filteredGuests" :key="guest.id">
                    <GuestCard :guest="guest">
                        <ConfirmAction alert-title="Set number of drinks for guest"
                            @on-confirm="updateDrinkCount(guest, drinkCount)">
                            <Badge class="cursor-pointer">
                                {{ guest.drinks?.numberOfDrinks ?? 0 }}
                            </Badge>
                            <template v-slot:content>
                                <Input v-model="drinkCountComputed" type="number" min="0"></Input>
                            </template>
                        </ConfirmAction>
                    </GuestCard>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Guest } from '@/models/Guest';
import { WeddingEvent } from '@/models/WeddingEvent';
import { Separator } from '@/components/ui/separator'
import { ref, watch, computed } from 'vue';
import GuestCard from '@/components/events/GuestCard.vue';
import Search from '@/components/Search.vue';
import debounce from 'lodash/debounce';
import { Badge } from '@/components/ui/badge'
import { GuestService } from '@/services/GuestService';
import { SuccessHandler } from '@/util/SuccessHandler';
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';
import Input from '@/components/ui/input/Input.vue';
import { ErrorHandler } from '@/util/error/ErrorHandler';

const props = defineProps<{
    weddingEvent: WeddingEvent | null;
    eventGuests: Guest[];
}>();

const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const drinkCount = ref<number>(0);

const drinkCountComputed = computed({
    get() {
        return drinkCount.value;
    },
    set(val) {
        drinkCount.value = val;
    }
})

const eventNameComputed = computed(() => {
    return props.weddingEvent ? props.weddingEvent.name : 'Event';
});

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

const filteredGuests = computed(() => {
    let guests = props.eventGuests;

    if (debouncedSearchQuery.value) {
        guests = guests.filter(guest =>
            guest.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }

    return guests;
});


watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

async function updateDrinkCount(guest: Guest, count: number) {
    if (guest && guest.drinks && props.weddingEvent) {
        guest.drinks.numberOfDrinks = Number(count) || 0;

        const guestService = new GuestService();
        await guestService.saveGuest(guest);

        SuccessHandler.showNotification(`${guest.name} has had ${guest.drinks.numberOfDrinks} drink(s).`);
    } else {
        ErrorHandler.handleCustomError('Guest not found or invalid event.');
    }
}



</script>