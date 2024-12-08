<template>
  <div>
    <div v-if="!loading">
      <div class="text-xl mx-5">Please Click on a Survey Below to Begin:</div>
      <SurveyList :surveys="assignedSurveys" :guest-survey-responses="guestSurveyResponses" />
    </div>
    <Loader v-else />
  </div>
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
import Loader from '@/components/Loader.vue';

const userStore = useUserStore();
const { loggedInGuest } = storeToRefs(userStore);

const assignedSurveys = ref<Survey[]>([]);
const guestSurveyResponses = ref<SurveyResponse[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
  loading.value = true;
  if (loggedInGuest.value) {
    const surveyResponseService = new SurveyResponseService();
    guestSurveyResponses.value = await surveyResponseService.getAllSurveyResponsesForGuest(loggedInGuest.value);
    const surveyService = new SurveyService();
    const allSurveys = await surveyService.getPublishedSurveys();
    assignedSurveys.value = allSurveys.filter((survey: Survey) => !guestSurveyResponses.value.some(surveyResponse => survey.id === surveyResponse.survey.id));
  }
  loading.value = false;
});
</script>