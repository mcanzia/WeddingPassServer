<template>
    <TooltipProvider :delay-duration="100">
        <Tooltip>
            <TooltipTrigger>
                <span :class="['inline-flex items-center justify-center w-6 h-6 rounded-full', colorClass]"
                    :title="eventName">
                    <span class="text-center text-white font-semibold">{{ eventNameInitial }}</span>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ eventName }}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>

<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { eventColorMap } from '@/components/data-table/EventColorMap';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

const props = defineProps<{
    eventName: string;
}>();

const colorClass = computed(() => {
    return eventColorMap[props.eventName] || 'bg-gray-500';
});

const eventNameInitial = computed(() => {
    return props.eventName.charAt(0).toLocaleUpperCase();
});
</script>

<style scoped></style>