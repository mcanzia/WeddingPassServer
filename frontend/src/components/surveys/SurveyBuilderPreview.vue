<template>
    <Card class="mx-auto max-h-[85vh]">
        <CardHeader>
            <CardTitle class="text-2xl">
                {{ surveyTitleComputed }}
            </CardTitle>
            <Separator />
        </CardHeader>
        <CardContent class="flex flex-col gap-4 max-h-[70vh]">
            <ScrollArea class="h-screen">
                <div ref="parent" class="grid grid-cols-2 gap-5">
                    <BaseSurveyComponent v-for="display in displayComponents" :key="display.surveyComponent.id"
                        :display-component="display.displayComponent" v-model="display.surveyComponent.value"
                        :builder-mode="!previewMode" :has-options="display.hasOptions"
                        :componentDetails="display.surveyComponent" @remove="remove"
                        :class="`${previewMode ? 'my-5' : 'my-2'}`" />
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { storeToRefs } from 'pinia';
import { useSurveyStore } from '@/stores/SurveyStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import BaseSurveyComponent from '@/components/surveys/BaseSurveyComponent.vue';
import { computed } from 'vue';
import { useDragAndDrop } from "@formkit/drag-and-drop/vue";
import { SurveyDisplayComponent } from '@/models/SurveyDisplayComponent';

const { survey, surveyDisplayComponents, previewMode, savedStatus } = storeToRefs(useSurveyStore());
const { removeSurveyComponent, updateComponentsOrder } = useSurveyStore();
// @ts-ignore
const [parent, displayComponents] = useDragAndDrop(surveyDisplayComponents, 
{
    dragDropEffect: 'move', 
    dragHandle: ".kanban-handle",
    dropZoneClass: "drop-zone",
    onDragend: updateComponentsOrder
}
) as [
  HTMLElement,
  SurveyDisplayComponent[]
];

const surveyTitleComputed = computed(() => {
    if (survey.value) {
        return survey.value.title;
    }
});

function remove(componentId: string) {
    removeSurveyComponent(componentId);
    savedStatus.value = false;
}

</script>

<style scoped>
.drop-zone {
    opacity: 90%;
    border: solid 2px white;
}
</style>