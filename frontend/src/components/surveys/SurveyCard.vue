<template>
    <div class="flex-1 mt-5 max-w-sm">
        <Card class="mx-auto flex flex-col hover:bg-slate-700">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    {{ survey.title }}
                </CardTitle>
                <Separator />
            </CardHeader>
            <CardContent>
                <span v-if="surveyStatusComputed">Status: {{ surveyStatusComputed }}</span>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { Survey } from '@/models/Survey';
import CardContent from '../ui/card/CardContent.vue';
import { computed } from 'vue';
import { SurveyResponse } from '@/models/SurveyResponse';
import { useSurveyTypeGuard } from '@/components/surveys/useSurveyTypeGuard';

const props = defineProps<{
  adminMode?: boolean;
  survey: Survey | SurveyResponse;
}>();

const {isSurvey, isSurveyResponse} = useSurveyTypeGuard();


const surveyStatusComputed = computed(() => {
    if (props.adminMode && isSurvey(props.survey)) {
        return props.survey.published ? 'Published' : 'In Development';
    } else if (!props.adminMode && isSurveyResponse(props.survey)) {
        return props.survey.submitted ? 'Submitted' : 'In Progress';
    } else {
        return 'New';
    }
    
})

</script>