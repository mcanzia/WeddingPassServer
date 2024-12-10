<template>
  <div>
    <Card class="mx-auto max-h-[85vh] my-5 bg-inherit border-none max-w-screen-sm"
      v-if="currentSurveyResponse && !loading">
      <CardHeader>
        <div class="inline-flex justify-between">
          <CardTitle class="text-2xl font-['Faculty_Glyphic']">
            {{ currentSurveyResponse.survey.title }}
          </CardTitle>
        </div>
        <div class="grid gap-2">
          <Label for="party-members">Party Members</Label>
          <div class="flex inline-flex gap-5">
            <SingleSelectDropdown v-model="currentPartyMemberComputed" :select-options="partyMemberNames"
              id="party-members" class="w-full" />
            <ConfirmAction alert-title="Copy responses of another party member?"
              alert-description="You will still need to Submit the survey after copying." @on-confirm="copyResponses"
              :disabled="currentSurveyResponse.submitted">
              <Button class="bg-border text-black hover:bg-border" :disabled="currentSurveyResponse.submitted">Copy
                Responses</Button>
              <template v-slot:content>
                <div class="max-w-sm">
                  <SingleSelectDropdown v-model="copyResponsesMemberComputed" :select-options="partyMemberNames"
                    id="copy-responses-members" />
                </div>
              </template>
            </ConfirmAction>
          </div>
        </div>
        <div class="grid gap-2 max-w-sm flex justify-center">
          <Badge class="w-[40vw] max-w-sm mt-2 flex justify-center"
            :class="{ 'bg-green-500 text-black hover:bg-green-400': currentSurveyResponse.submitted }">
            {{ currentSurveyStatus }}
          </Badge>
        </div>
      </CardHeader>
      <CardContent class="flex flex-col gap-4 max-h-[70vh]">
        <Separator />
        <ScrollArea scrollbar-color="#ffffff" class="h-[55vh]">
          <div ref="parent" class="grid gap-5 font-['Faculty_Glyphic']">
            <BaseSurveyComponent v-for="display in currentSurveyResponse.survey.surveyComponents" :key="display.id"
              :modelValue="display.componentValue" :builder-mode="false" :componentDetails="display"
              :disabled="currentSurveyResponse.submitted" :guest="currentSurveyResponse.guest"
              @update:modelValue="handleValueUpdate" class="my-0" />
          </div>
        </ScrollArea>
        <Button @click="submitSurveyResponse" :disabled="currentSurveyResponse.submitted">{{ submitButtonText
          }}</Button>
      </CardContent>
    </Card>
    <Loader v-else />
  </div>

</template>

<script setup lang="ts">
import BaseSurveyComponent from '@/components/surveys/BaseSurveyComponent.vue';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SurveyResponse } from '@/models/SurveyResponse';
import { Separator } from "@/components/ui/separator";
import { useSurveyResponseStore } from '@/components/surveys/SurveyResponseStore';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, useAttrs } from 'vue';
import { Button } from "@/components/ui/button";
import { NotificationType } from '@/models/NotificationType';
import { useNotificationStore } from '@/stores/NotificationStore';
import { Guest } from '@/models/Guest';
import { Label } from "@/components/ui/label";
import SingleSelectDropdown from '@/components/common/SingleSelectDropdown.vue';
import { useUserStore } from '@/stores/UserStore';
import { GuestService } from '@/services/GuestService';
import Badge from '@/components/ui/badge/Badge.vue';
import Loader from '../Loader.vue';
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';

const surveyResponseStore = useSurveyResponseStore();
const { surveyResponses, currentSurveyResponse, partyMembers, currentSurveyStatus } = storeToRefs(surveyResponseStore);
const { updateComponentValue, fetchPartySurveyResponses, saveSurveyResponse } = surveyResponseStore;
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { loggedInGuest } = storeToRefs(userStore);
const attrs = useAttrs();

const loading = ref(false);
const copyResponsesMember = ref<SurveyResponse>();

onMounted(async () => {
  loading.value = true;
  // TODO make sure that updated guest values are shown if updated outside of survey
  await fetchPartySurveyResponses(attrs.surveyId as string, loggedInGuest.value, attrs.surveyResponseId as string);
  loading.value = false;
});

const partyMemberNames = computed(() => {
  if (partyMembers.value) {
    return partyMembers.value.map(partyMember => partyMember.name);
  }
  return [];
});

const currentPartyMemberComputed = computed({
  get() {
    return currentSurveyResponse.value?.guest.name;
  },
  set(val) {
    const selectedGuest = partyMembers.value?.find(member => member.name === val);
    if (selectedGuest) {
      currentSurveyResponse.value = surveyResponses.value?.find(surveyResponse => surveyResponse.guest.id === selectedGuest.id);
    }
  }
});

const copyResponsesMemberComputed = computed({
  get() {
    return copyResponsesMember.value?.guest.name;
  },
  set(val) {
    const selectedGuest = partyMembers.value?.find(member => member.name === val);
    if (selectedGuest) {
      copyResponsesMember.value = surveyResponses.value?.find(surveyResponse => surveyResponse.guest.id === selectedGuest.id);
    }
  }
});

const submitButtonText = computed(() => {
  if (currentSurveyResponse.value && currentSurveyResponse.value.submitted) {
    return 'Survey Submitted';
  }
  return 'Submit';
});

function handleValueUpdate(componentId: string, value: any) {
  if (currentSurveyResponse.value && currentSurveyResponse.value.survey.surveyComponents) {
    updateComponentValue(currentSurveyResponse.value.survey.surveyComponents, componentId, value);
  }
}

function copyResponses() {
  const copyComponents = copyResponsesMember.value?.survey?.surveyComponents;
  const currentComponents = currentSurveyResponse.value?.survey?.surveyComponents;

  if (copyComponents && currentComponents && currentSurveyResponse.value) {
    const holdName = currentComponents.find(component => component.infoLookupField === 'name');

    currentSurveyResponse.value.survey.surveyComponents = copyComponents.map(component => {
      if (holdName && component.id === holdName.id) {
        return holdName;
      }
      return component;
    });
  }
}


async function submitSurveyResponse() {
  currentSurveyResponse.value = { ...currentSurveyResponse.value, submitted: true } as SurveyResponse;
  await saveSurveyResponse();
  setMessage('Submitted survey response.', NotificationType.SUCCESS);
}
</script>