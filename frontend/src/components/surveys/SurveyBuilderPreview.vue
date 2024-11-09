<template>
    <Card class="mx-auto max-h-[85vh]">
        <CardHeader>
            <CardTitle class="text-2xl">
                {{ survey?.title }}
            </CardTitle>
            <Separator />
        </CardHeader>
        <CardContent class="flex flex-col gap-4 max-h-[70vh]">
            <ScrollArea class="h-screen">
                <BaseSurveyComponent v-for="display in surveyDisplayComponents" :key="display.surveyComponent.id"
                    :display-component="display.displayComponent" v-model="display.surveyComponent.value" :builder-mode="!previewMode" :has-options="display.hasOptions"
                    :componentDetails="display.surveyComponent" @remove="remove" class="my-2" />
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


const { survey, surveyDisplayComponents, previewMode } = storeToRefs(useSurveyStore());
const { removeSurveyComponent } = useSurveyStore();

function remove(componentId: string) {
    removeSurveyComponent(componentId);
}



</script>