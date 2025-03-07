<template>
    <div class="flex-1 mt-5 h-screen">
        <Card class="mx-auto max-w-sm h-3/4 flex flex-col" v-if="!loading">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Sub Events
                </CardTitle>
                <Search class="mb-4" placeholder="Search subevent name..." v-model="searchQuery" />
                <Button @click="goToUpdateSubEvent">New</Button>
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <div v-if="filteredSubEvents.length === 0">No Sub Events</div>
                <div v-else v-for="subEvent in filteredSubEvents" :key="subEvent.id">
                    <SubEventCard :sub-event="subEvent" @edit-sub-event="goToUpdateSubEvent(subEvent)"></SubEventCard>
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
import { SubEvent } from '@/models/SubEvent';
import SubEventCard from '@/components/subevents/SubEventCard.vue';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { SubEventService } from '@/services/SubEventService';
import Loader from '@/components/Loader.vue';

const { goToRouteSecured } = useRouterHelper();

onMounted(async () => {
    loading.value = true;
    const subEventService = new SubEventService();
    allSubEvents.value = await subEventService.getAllSubEvents();
    loading.value = false;
});

const allSubEvents = ref<SubEvent[]>([]);
const loading = ref(false);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

const filteredSubEvents = computed(() => {
    let localSubEvents = allSubEvents.value;

    if (debouncedSearchQuery.value) {
        localSubEvents = localSubEvents.filter(subEvent =>
            subEvent.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localSubEvents;
});

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

function goToUpdateSubEvent(subEvent?: SubEvent) {
    subEvent ? goToRouteSecured('edit-sub-event', { subEventId: subEvent.id }) : goToRouteSecured('edit-sub-event');
}

</script>