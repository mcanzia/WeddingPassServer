<template>
  <Card :class="`mx-auto max-h-[85vh]`">
    <CardHeader>
      <CardTitle class="text-2xl font-['Faculty_Glyphic']">
        {{ surveyTitleComputed }}
      </CardTitle>
    </CardHeader>
    <CardContent class="flex flex-col gap-4 max-h-[70vh]">
      <Separator />
      <ScrollArea class="h-screen">
        <div ref="parent" class="grid gap-5 font-['Faculty_Glyphic']">
          <BaseSurveyComponent v-for="display in displayComponents" :key="display.id"
            :modelValue="display.componentValue" :builder-mode="!previewMode" :componentDetails="display"
            @remove="remove" @openAddChild="handleOpenAddChild" @update:modelValue="handleValueUpdate"
            :class="`${previewMode ? 'my-0' : 'my-2'}`" />
        </div>
      </ScrollArea>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { storeToRefs } from "pinia";
import { useSurveyStore } from "@/components/surveys/SurveyStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import BaseSurveyComponent from "@/components/surveys/BaseSurveyComponent.vue";
import { computed } from "vue";
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { SurveyComponent } from "@/models/SurveyComponent";

const { survey, previewMode, savedStatus } = storeToRefs(useSurveyStore());
const {
  removeSurveyComponent,
  updateComponentsOrder,
  openAddChild,
  updateComponentValue,
} = useSurveyStore();
// @ts-ignore
const [parent, displayComponents] = useDragAndDrop(
  survey.value?.surveyComponents!,
  {
    dragDropEffect: "move",
    dragHandle: ".kanban-handle",
    dropZoneClass: "drop-zone",
    onDragend(newOrder) {
      updateComponentsOrder(newOrder.values as SurveyComponent[]);
    },
  }
) as [HTMLElement, SurveyComponent[]];

const surveyTitleComputed = computed(() => {
  if (survey.value) {
    return survey.value.title;
  }
});

function remove(componentId: string, parentId: string) {
  if (survey.value && survey.value.surveyComponents) {
    removeSurveyComponent(survey.value.surveyComponents, componentId, parentId);
    savedStatus.value = false;
  }
}

function handleOpenAddChild(componentId: string) {
  openAddChild(componentId);
}

function handleValueUpdate(componentId: string, value: any) {
  if (previewMode.value && survey.value && survey.value.surveyComponents) {
    updateComponentValue(survey.value.surveyComponents, componentId, value);
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Geist:wght@100..900&display=swap");

.drop-zone {
  opacity: 90%;
  border: solid 2px white;
}

.maybe-survey-settings {
  /*bg-[#FCF4EB] text-zinc-950*/
}
</style>