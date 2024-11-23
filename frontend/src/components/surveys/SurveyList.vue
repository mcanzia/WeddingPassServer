<template>
  <div class="mx-4 mt-4">
    <div class="inline-flex gap-4">
      <Search
        class="mb-4"
        placeholder="Search for survey..."
        v-model="searchQuery"
      />
      <Button
        v-if="adminMode"
        @click="goToEditSurvey(null)"
      >Create Survey</Button>
    </div>
    <div v-if="surveys.length">
      <SurveyCard
        class="cursor-pointer"
        v-for="survey in filteredSurveys"
        :survey="survey"
        :key="survey.id"
        @click="goToEditSurvey(survey)"
      />
    </div>
    <div v-if="surveyResponses.length">
      <SurveyCard
        class="cursor-pointer"
        v-for="survey in filteredSurveys"
        :survey="survey"
        :key="survey.id"
        @click="goToEditSurvey(survey)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import Search from "@/components/Search.vue";
import { ref, watch, computed, PropType } from "vue";
import debounce from "lodash/debounce";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import SurveyCard from "@/components/surveys/SurveyCard.vue";
import { Survey } from "@/models/Survey";
import { useSurveyStore } from "@/components/surveys/SurveyStore";
import { SurveyResponse } from "@/models/SurveyResponse";

const surveyStore = useSurveyStore();
const { survey } = storeToRefs(surveyStore);
const { saveSurvey } = surveyStore;

const props = defineProps({
  adminMode: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  surveys: {
    type: Array as PropType<Survey[]>,
    required: false,
    default: () => [],
  },
  surveyResponses: {
    type: Array as PropType<SurveyResponse[]>,
    required: false,
    default: () => []
  }
});

const { goToRoute, goToRouteSecured } = useRouterHelper();
const searchQuery = ref("");
const debouncedSearchQuery = ref("");

const filteredSurveys = computed(() => {
  let localSurveys = props.surveys;

  if (debouncedSearchQuery.value) {
    localSurveys = localSurveys.filter((survey) =>
      survey.title
        .toLowerCase()
        .includes(debouncedSearchQuery.value.toLowerCase())
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
  if (!props.adminMode) {
    return;
  }
  if (!surveyToEdit) {
    survey.value = {
      title: "New Survey",
      surveyComponents: [],
      published: false,
    } as Survey;
    await saveSurvey();
    goToRouteSecured("edit-survey", { surveyId: survey.value.id });
  } else {
    goToRouteSecured("edit-survey", { surveyId: surveyToEdit.id });
  }
}
</script>