<template>
    <div class="flex-1 mt-5 h-screen">
        <Card class="mx-auto max-w-sm h-3/4 flex flex-col">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Survey Responses
                </CardTitle>
                <ToggleGroup v-model="filterToggle" type="single" variant="outline"
                    class="my-4 flex justify-center gap-6">
                    <ToggleGroupItem value="submitted" key="submitted">
                        Only Submitted
                    </ToggleGroupItem>
                    <ToggleGroupItem value="unsubmitted" key="unsubmitted">
                        Only Not Submitted
                    </ToggleGroupItem>
                </ToggleGroup>
                <Search class="mb-4" placeholder="Search guest name..." v-model="searchQuery" />
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <div v-if="filteredResponses.length === 0">No Guests</div>
                <div v-else v-for="response in filteredResponses" :key="response.guest.id">
                    <GuestCard :guest="response.guest" :submitted="isGuestSubmitted(response)">
                        <Badge class="cursor-pointer">
                            {{ submittedText(response) }}
                        </Badge>
                    </GuestCard>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { ref, watch, computed, onMounted } from 'vue';
import GuestCard from '@/components/events/GuestCard.vue';
import Search from '@/components/Search.vue';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import debounce from 'lodash/debounce';
import { Badge } from '@/components/ui/badge'
import { SurveyResponse } from '@/models/SurveyResponse';
import { SurveyResponseService } from '@/services/SurveyResponseService';

const props = defineProps<{
    surveyId: string | null;
}>();

onMounted(async () => {
    if (props.surveyId) {
        const surveyResponseService = new SurveyResponseService();
        allSurveyResponses.value = await surveyResponseService.getAllSurveyResponses(props.surveyId);
    }
});

const allSurveyResponses = ref<SurveyResponse[]>([]);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const filterToggle = ref(undefined);

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

const filteredResponses = computed(() => {
    let localResponses = allSurveyResponses.value;

    if (filterToggle.value && filterToggle.value === 'submitted') {
        localResponses = localResponses.filter(response => response.submitted);
    } else if (filterToggle.value && filterToggle.value === 'unsubmitted') {
        localResponses = localResponses.filter(response => !response.submitted);
    }

    if (debouncedSearchQuery.value) {
        localResponses = localResponses.filter(response =>
            response.guest.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localResponses;
});

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

function isGuestSubmitted(response: SurveyResponse) {
    return response.submitted;
}

function submittedText(response: SurveyResponse) {
    return isGuestSubmitted(response) ? 'Submitted' : 'Not Submitted';
}


</script>