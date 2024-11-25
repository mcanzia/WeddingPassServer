<template>
  <SurveyList :surveys="assignedSurveys" :survey-responses="surveyResponses" />
</template>

<script setup lang="ts">
import { Survey } from "@/models/Survey";
import { SurveyService } from "@/services/SurveyService";
import { onMounted, ref } from "vue";
import SurveyList from "@/components/surveys/SurveyList.vue";
import { SurveyResponse } from "@/models/SurveyResponse";
import { SurveyResponseService } from "@/services/SurveyResponseService";
import { useUserStore } from "@/stores/UserStore";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const {loggedInGuest} = storeToRefs(userStore);

const assignedSurveys = ref<Survey[]>([]);
const surveyResponses = ref<SurveyResponse[]>([]);

onMounted(async () => {
  if(loggedInGuest.value) {
    const surveyResponseService = new SurveyResponseService();
    surveyResponses.value = await surveyResponseService.getAllSurveyResponsesForGuest(loggedInGuest.value);
    const surveyService = new SurveyService();
    const allSurveys = await surveyService.getPublishedSurveys();
    assignedSurveys.value = allSurveys.filter((survey: Survey) => !surveyResponses.value.some(surveyResponse => survey.id === surveyResponse.surveyId));
  }
});
</script>