<template>
  <Card :class="`mx-auto max-h-[85vh] my-5`" v-if="surveyResponse">
    <CardHeader>
      <div class="inline-flex justify-between">
        <CardTitle class="text-2xl font-['Faculty_Glyphic']">
          {{ surveyResponse.title }}
        </CardTitle>
        <Button @click="submitSurveyResponse">Submit</Button>
      </div>
      <div class="grid gap-2">
        <Label for="party-members">Party Members</Label>
        <SingleSelectDropdown v-model="currentPartyMemberComputed" :select-options="partyMembers"
          id="party-members" />
      </div>
    </CardHeader>
    <CardContent class="flex flex-col gap-4 max-h-[70vh]">
      <Separator />
      <ScrollArea class="h-screen">
        <div ref="parent" class="grid gap-5 font-['Faculty_Glyphic']">
          <BaseSurveyComponent v-for="display in surveyResponse.responses" :key="display.id"
            :modelValue="display.componentValue" :builder-mode="false" :componentDetails="display" :guest="currentGuest"
            @update:modelValue="handleValueUpdate" class="my-0" />
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
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

const surveyResponseStore = useSurveyResponseStore();
const { surveyResponse, currentGuest } = storeToRefs(surveyResponseStore);
const { updateComponentValue, fetchSurveyResponse, saveSurveyResponse } = surveyResponseStore;
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const attrs = useAttrs();

const partyMembers = ref<Guest[]>();

onMounted(async () => {
  // TODO make sure that updated guest values are shown if updated outside of survey
  await fetchSurveyResponse(attrs.surveyId as string, attrs.surveyResponseId as string);
  // await fetchPartyMembers();
});

const currentPartyMemberComputed = computed({
  get() {

  },
  set(val) {

  }
});

function handleValueUpdate(componentId: string, value: any) {
  if (surveyResponse.value && surveyResponse.value.responses) {
    updateComponentValue(surveyResponse.value.responses, componentId, value);
  }
}

async function submitSurveyResponse() {
  surveyResponse.value = { ...surveyResponse.value, submitted: true } as SurveyResponse;
  await saveSurveyResponse();
  setMessage('Submitted survey response.', NotificationType.SUCCESS);
}
</script>