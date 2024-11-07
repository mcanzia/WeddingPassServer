<template>
    <div class="grid grid-cols-6 mt-5 mx-5 gap-5">
        <SurveyBuilderDetails class="w-full col-span-2" />
        <SurveyBuilderPreview class="w-full col-span-4" />
    </div>

</template>

<script setup lang="ts">
import SurveyBuilderDetails from '@/components/surveys/SurveyBuilderDetails.vue';
import SurveyBuilderPreview from '@/components/surveys/SurveyBuilderPreview.vue';
import { SurveyComponent } from '@/models/SurveyComponent';
import { computed, onMounted, ref } from 'vue';
import { useSurveyStore } from '@/stores/SurveyStore';
import { storeToRefs } from 'pinia';
import { Survey } from '@/models/Survey';

const {survey} = storeToRefs(useSurveyStore());

onMounted(() => {
    survey.value = {
        title: 'New Survey',
        surveyComponents: []
    } as Survey
});

</script>