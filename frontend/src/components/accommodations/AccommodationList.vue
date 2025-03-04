<template>
    <div class="flex-1 mt-5 h-screen">
        <Card class="mx-auto max-w-sm h-3/4 flex flex-col" v-if="!loading">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Accommodations
                </CardTitle>
                <Search class="mb-4" placeholder="Search accommodation name..." v-model="searchQuery" />
                <Button @click="goToUpdateAccommodation">New</Button>
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <div v-if="filteredAccommodations.length === 0">No Accommodations</div>
                <div v-else v-for="accommodation in filteredAccommodations" :key="accommodation.id">
                    <AccommodationCard :accommodation="accommodation"
                        @editAccommodation="goToUpdateAccommodation(accommodation)"></AccommodationCard>
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
import { Accommodation } from '@/models/Accommodation';
import AccommodationCard from '@/components/accommodations/AccommodationCard.vue';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import Loader from '@/components/Loader.vue';
import { AccommodationService } from '@/services/AccommodationService';

const { goToRouteSecured } = useRouterHelper();

onMounted(async () => {
    loading.value = true;
    const accommodationService = new AccommodationService();
    allAccommodations.value = await accommodationService.getAllAccommodations();
    loading.value = false;
});

const allAccommodations = ref<Accommodation[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

const filteredAccommodations = computed(() => {
    let localAccommodations = allAccommodations.value;

    if (debouncedSearchQuery.value) {
        localAccommodations = localAccommodations.filter(accommodation =>
            accommodation.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localAccommodations;
});

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

function goToUpdateAccommodation(accommodation?: Accommodation) {
    accommodation ? goToRouteSecured('edit-accommodation', { accommodationId: accommodation.id }) : goToRouteSecured('edit-accommodation');
}

</script>