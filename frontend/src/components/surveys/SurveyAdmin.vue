<template>
  <SurveyList
    admin-mode
    :surveys="allSurveys"
  />
</template>

<script setup lang="ts">
import { Survey } from "@/models/Survey";
import { SurveyService } from "@/services/SurveyService";
import { onMounted, ref } from "vue";
import SurveyList from "@/components/surveys/SurveyList.vue";

const allSurveys = ref<Survey[]>([]);

onMounted(async () => {
  const surveyService = new SurveyService();
  allSurveys.value = await surveyService.getAllSurveys();
});
</script>