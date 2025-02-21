<template>
    <TooltipProvider :delay-duration="100">
        <Tooltip>
            <TooltipTrigger>
                <span :class="['inline-flex items-center justify-center w-6 h-6 rounded-full', colorClass]"
                    :title="subEvent.name">
                    <span class="text-center text-white font-semibold">{{ subEventNameInitial }}</span>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ subEvent.name }}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { subEventColorMap } from '@/components/data-table/SubEventColorMap';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'
import { SubEvent } from '@/models/SubEvent';

const props = defineProps<{
    subEvent: SubEvent;
}>();

const colorClass = computed(() => {
    return subEventColorMap[props.subEvent.name] || 'bg-gray-500';
});

const subEventNameInitial = computed(() => {
    return props.subEvent.name.charAt(0).toLocaleUpperCase();
});
</script>

<style scoped></style>