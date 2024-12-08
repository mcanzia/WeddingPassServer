<template>
    <div class="flex-1 mt-5 h-screen">
        <Card class="mx-auto max-w-sm h-3/4 flex flex-col" v-if="!loading">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Hotels
                </CardTitle>
                <Search class="mb-4" placeholder="Search hotel name..." v-model="searchQuery" />
                <Button @click="goToUpdateHotel">New</Button>
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <div v-if="filteredHotels.length === 0">No Hotels</div>
                <div v-else v-for="hotel in filteredHotels" :key="hotel.id">
                    <HotelCard :hotel="hotel" @editHotel="goToUpdateHotel(hotel)"></HotelCard>
                </div>
            </CardContent>
        </Card>
        <Loader v-else />
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button/Button.vue';
import { Separator } from '@/components/ui/separator'
import { ref, watch, computed, onMounted } from 'vue';
import Search from '@/components/Search.vue';
import debounce from 'lodash/debounce';
import { Hotel } from '@/models/Hotel';
import HotelCard from '@/components/hotels/HotelCard.vue';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { HotelService } from '@/services/HotelService';
import Loader from '@/components/Loader.vue';

const { goToRouteSecured } = useRouterHelper();

onMounted(async () => {
    loading.value = true;
    const hotelService = new HotelService();
    allHotels.value = await hotelService.getAllHotels();
    loading.value = false;
});

const allHotels = ref<Hotel[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

const filteredHotels = computed(() => {
    let localHotels = allHotels.value;

    if (debouncedSearchQuery.value) {
        localHotels = localHotels.filter(hotel =>
            hotel.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localHotels;
});

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

function goToUpdateHotel(hotel?: Hotel) {
    hotel ? goToRouteSecured('edit-hotel', { hotelId: hotel.id }) : goToRouteSecured('edit-hotel');
}

</script>