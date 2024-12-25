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
                        <div class="flex inline-flex">
                            <IconButton icon="remove-outline" @click="decrementDrinkCount(guest)"></IconButton>
                            <Badge class="cursor-pointer">
                                {{ getGuestDrinkCount(guest)?.numberOfDrinks ?? 0 }}
                            </Badge>
                            <IconButton icon="add-outline" @click="incrementDrinkCount(guest)"></IconButton>
                        </div>
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
import { ErrorHandler } from '@/util/error/ErrorHandler';
import IconButton from '@/components/common/IconButton.vue';
import { DrinkCount } from '@/models/DrinkCount';

const props = defineProps<{
    weddingEvent: WeddingEvent | null;
    eventGuests: Guest[];
}>();

const searchQuery = ref('');
const debouncedSearchQuery = ref('');

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

    return guests.sort((a, b) => getGuestDrinkCount(b)?.numberOfDrinks! - getGuestDrinkCount(a)?.numberOfDrinks!);
});


watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

function getGuestDrinkCount(guest: Guest) {
    if (guest && guest.drinks && guest.drinks.drinkCount && props.weddingEvent) {
        return guest.drinks.drinkCount.find(drinkCount => drinkCount.event.id === props.weddingEvent?.id);
    }
}

async function updateDrinkCount(guest: Guest, increment: boolean) {
    if (guest && guest.drinks && props.weddingEvent) {
        let count = 0;
        if (!guest.drinks.drinkCount) {
            guest.drinks.drinkCount = [];
        }
        if (!guest.drinks.drinkCount.some(drinkCount => drinkCount.event.id === props.weddingEvent?.id)) {
            guest.drinks.drinkCount.push(new DrinkCount(0, props.weddingEvent));
        }
        guest.drinks.drinkCount.map(drinkCount => {
            if (drinkCount.event.id === props.weddingEvent?.id) {
                count = increment ? Number(drinkCount.numberOfDrinks) + 1 : drinkCount.numberOfDrinks > 0 ? Number(drinkCount.numberOfDrinks) - 1 : 0;
                drinkCount.numberOfDrinks = count;
            }
            return drinkCount;
        });

        const guestService = new GuestService();
        await guestService.saveGuest(guest);

        if (count >= 4) {
            SuccessHandler.showNotification(`${guest.name} has had ${count} drink(s).`, 'Alert', 'destructive');
        } else {
            SuccessHandler.showNotification(`${guest.name} has had ${count} drink(s).`);
        }
    } else {
        ErrorHandler.handleCustomError('Guest not found or invalid event.');
    }
}

function decrementDrinkCount(guest: Guest) {
    updateDrinkCount(guest, false);
}

function incrementDrinkCount(guest: Guest) {
    updateDrinkCount(guest, true);
}



</script>