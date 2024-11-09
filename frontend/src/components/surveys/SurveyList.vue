<template>
    <div class="mx-4 mt-4">
        <div class="inline-flex gap-4">
            <Search class="mb-4" placeholder="Search for survey..." v-model="searchQuery" />
            <Button @click="goToEditSurvey(null)">Create Survey</Button>
        </div>
        <SurveyCard class="cursor-pointer" v-if="allSurveys.length" v-for="survey in filteredSurveys" :survey="survey"
            :key="survey.id" @click="goToEditSurvey(survey)" />
    </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
import Search from '@/components/Search.vue';
import { ref, onMounted, watch, computed } from 'vue';
import debounce from 'lodash/debounce';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import SurveyCard from '@/components/surveys/SurveyCard.vue';
import { Survey } from '@/models/Survey';
import { SurveyService } from '@/services/SurveyService';
import { useSurveyStore } from '@/stores/SurveyStore';

const surveyStore = useSurveyStore();
const { survey } = storeToRefs(surveyStore);
const {saveSurvey} = surveyStore;

onMounted(async () => {
    const surveyService = new SurveyService();
    allSurveys.value = await surveyService.getAllSurveys();
});

const { goToRoute, goToRouteSecured } = useRouterHelper();
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const allSurveys = ref<Survey[]>([]);

const filteredSurveys = computed(() => {
    let localSurveys = allSurveys.value;

    if (debouncedSearchQuery.value) {
        localSurveys = localSurveys.filter(survey =>
            survey.title.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localSurveys;
});

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});


async function goToEditSurvey(surveyToEdit: Survey | null) {
    if (!surveyToEdit) {
        survey.value = {
            title: 'New Survey',
            surveyComponents: []
        } as Survey
        await saveSurvey();
        goToRouteSecured('edit-survey', { surveyId: survey.value.id });
    } else {
        goToRouteSecured('edit-survey', { surveyId: surveyToEdit.id });
    }
    
}

</script>