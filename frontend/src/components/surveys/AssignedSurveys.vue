<template>
  <SurveyList :surveys="assignedSurveys" />
</template>

<script setup lang="ts">
import { Survey } from "@/models/Survey";
import { SurveyService } from "@/services/SurveyService";
import { onMounted, ref } from "vue";
import SurveyList from "@/components/surveys/SurveyList.vue";
import { SurveyResponse } from "@/models/SurveyResponse";

const assignedSurveys = ref<Survey[]>([]);
const surveyResponses = ref<SurveyResponse[]>([]);

onMounted(async () => {
  const surveyService = new SurveyService();
  assignedSurveys.value = await surveyService.getPublishedSurveys();
});
</script>