<template>
  <div class="mx-4 mt-4">
    <div class="inline-flex gap-4" v-if="adminMode">
      <Search class="mb-4" placeholder="Search for survey..." v-model="searchQuery" />
      <Button @click="goToEditSurvey(null)">Create Survey</Button>
    </div>
    <div v-if="surveys.length">
      <SurveyCard class="cursor-pointer" v-for="survey in filteredSurveys" :admin-mode="adminMode" :survey="survey"
        :title="survey.title" :key="survey.id" @click="goToEditSurvey(survey)" />
    </div>
    <div v-if="guestSurveyResponses.length">
      <SurveyCard class="cursor-pointer" v-for="surveyResponse in guestSurveyResponses" :survey="surveyResponse"
        :title="surveyResponse.survey.title" :key="surveyResponse.responseId"
        @click="goToCompleteSurvey(surveyResponse)" />
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
import { useSurveyResponseStore } from '@/components/surveys/SurveyResponseStore';
import { useUserStore } from "@/stores/UserStore";
import { useSurveyTypeGuard } from "@/components/surveys/useSurveyTypeGuard";
import { ErrorHandler } from "@/util/error/ErrorHandler";

const surveyStore = useSurveyStore();
const { survey } = storeToRefs(surveyStore);
const { saveSurvey } = surveyStore;
const surveyResponseStore = useSurveyResponseStore();
const { surveyResponses, currentSurveyResponse } = storeToRefs(surveyResponseStore);
const { initializeSurveysForParty } = surveyResponseStore;
const userStore = useUserStore();
const { loggedInGuest } = storeToRefs(userStore);

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
  guestSurveyResponses: {
    type: Array as PropType<SurveyResponse[]>,
    required: false,
    default: () => []
  }
});

const { goToRoute, goToRouteSecured } = useRouterHelper();
const { isSurvey, isSurveyResponse } = useSurveyTypeGuard();
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
    // const newSurvey : Survey = new Survey(surveyToEdit?.id!, surveyToEdit?.weddingId!, surveyToEdit?.title!, surveyToEdit?.surveyComponents!, surveyToEdit?.published!);
    goToCompleteSurvey(surveyToEdit!);
    return;
  }
  if (!surveyToEdit) {
    survey.value = {
      title: "New Survey",
      surveyComponents: [],
      published: false,
      showPartyMemberSurveys: false
    } as Survey;
    await saveSurvey();
    goToRouteSecured("edit-survey", { surveyId: survey.value.id });
  } else {
    goToRouteSecured("edit-survey", { surveyId: surveyToEdit.id });
  }
}

async function goToCompleteSurvey(surveyResponseToEdit: Survey | SurveyResponse) {
  if (isSurvey(surveyResponseToEdit)) {
    // Set initial guest values
    await initializeSurveysForParty(loggedInGuest.value, surveyResponseToEdit);
    if (currentSurveyResponse.value) {
      goToRouteSecured("survey-response", { surveyId: currentSurveyResponse.value.survey.id, surveyResponseId: currentSurveyResponse.value.responseId });
    } else {
      ErrorHandler.handleCustomError('Error loading survey.');
    }
  } else {
    goToRouteSecured("survey-response", { surveyId: surveyResponseToEdit.survey.id, surveyResponseId: surveyResponseToEdit.responseId });
  }
}
</script>