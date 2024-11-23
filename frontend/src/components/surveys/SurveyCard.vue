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
                <span>Status: {{ surveyStatus }}</span>
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

const props = defineProps<{
    survey: Survey;
}>();


const surveyStatus = computed(() => {
    return props.survey && props.survey.published ? 'Published' : 'In Development'
})

</script>