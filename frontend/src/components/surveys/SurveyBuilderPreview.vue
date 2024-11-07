<template>
    <Card class="mx-auto">
        <CardHeader>
            <CardTitle class="text-2xl">
               {{ survey?.title }}
            </CardTitle>
            <Separator />
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
            <Component v-for="display in surveyDisplayComponents" :key="display" :is="display.displayComponent" builder-mode :componentDetails="display.surveyComponent"></Component>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { storeToRefs } from 'pinia';
import { useSurveyStore } from '@/stores/SurveyStore';


const {survey, surveyDisplayComponents} = storeToRefs(useSurveyStore());



</script>