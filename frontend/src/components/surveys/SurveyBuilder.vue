<template>
    <div class="grid grid-cols-6 mt-5 mx-5 gap-5" v-if="survey">
        <SurveyBuilderDetails class="w-full col-span-2" />
        <SurveyBuilderPreview class="w-full col-span-4" />
    </div>

</template>

<script setup lang="ts">
import SurveyBuilderDetails from '@/components/surveys/SurveyBuilderDetails.vue';
import SurveyBuilderPreview from '@/components/surveys/SurveyBuilderPreview.vue';
import { onMounted, useAttrs } from 'vue';
import { useSurveyStore } from '@/stores/SurveyStore';
import { storeToRefs } from 'pinia';

const surveyStore = useSurveyStore();
const {survey} = storeToRefs(surveyStore);
const {fetchSurvey} = surveyStore;
const attrs = useAttrs();

onMounted(async () => await fetchSurvey(attrs.surveyId as string));

</script>