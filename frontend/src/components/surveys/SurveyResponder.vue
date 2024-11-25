<template>
    <Card :class="`mx-auto max-h-[85vh] my-5`" v-if="surveyResponse">
    <CardHeader>
      <div class="inline-flex justify-between">
        <CardTitle class="text-2xl font-['Faculty_Glyphic']">
        {{ surveyResponse.title }}
      </CardTitle>
      <Button @click="submitSurveyResponse">Submit</Button>
      </div>
    </CardHeader>
    <CardContent class="flex flex-col gap-4 max-h-[70vh]">
      <Separator />
      <ScrollArea class="h-screen">
        <div
          ref="parent"
          class="grid gap-5 font-['Faculty_Glyphic']"
        >
          <BaseSurveyComponent
            v-for="display in surveyResponse.responses"
            :key="display.id"
            :modelValue="display.componentValue"
            :builder-mode="false"
            :componentDetails="display"
            :guest="currentGuest"
            @update:modelValue="handleValueUpdate"
            class="my-0"
          />
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
import { onMounted, ref, useAttrs } from 'vue';
import { Guest } from '@/models/Guest';
import { useUserStore } from '@/stores/UserStore';
import { GuestService } from '@/services/GuestService';
import { Button } from "@/components/ui/button";

const surveyResponseStore = useSurveyResponseStore();
const {surveyResponse, currentGuest} = storeToRefs(surveyResponseStore);
const {updateComponentValue, fetchSurveyResponse, saveSurveyResponse} = surveyResponseStore;
const userStore = useUserStore();
const {loggedInGuest} = storeToRefs(userStore);
const attrs = useAttrs();

onMounted(async () => {
  if (loggedInGuest.value) {
    const guestService = new GuestService();
    currentGuest.value = await guestService.getGuestById(loggedInGuest.value);
    await fetchSurveyResponse(attrs.surveyId as string, attrs.surveyResponseId as string)
  }
});

function handleValueUpdate(componentId: string, value: any) {
  if (surveyResponse.value && surveyResponse.value.responses) {
    updateComponentValue(surveyResponse.value.responses, componentId, value);
  }
}

async function submitSurveyResponse() {
  surveyResponse.value = {...surveyResponse.value, submitted: true} as SurveyResponse;
  await saveSurveyResponse();
}
</script>