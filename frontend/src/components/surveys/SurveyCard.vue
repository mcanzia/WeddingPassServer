<template>
    <div class="flex-1 mt-5 max-w-sm">
        <Card class="mx-auto flex flex-col hover:bg-slate-700">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    {{ survey.title }}
                </CardTitle>
                <Separator />
            </CardHeader>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { Survey } from '@/models/Survey';

const props = defineProps<{
    survey: Survey;
}>();


</script>