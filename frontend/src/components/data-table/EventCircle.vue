<template>
    <TooltipProvider :delay-duration="100">
        <Tooltip>
            <TooltipTrigger>
                <span :class="['inline-flex items-center justify-center w-6 h-6 rounded-full', colorClass]"
                    :title="event.name">
                    <span class="text-center text-white font-semibold">{{ eventNameInitial }}</span>
                </span>
            </TooltipTrigger>
            <TooltipContent>
                <p>{{ event.name }}</p>
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
import { WeddingEvent } from '@/models/WeddingEvent';

const props = defineProps<{
    event: WeddingEvent;
}>();

const colorClass = computed(() => {
    return eventColorMap[props.event.name] || 'bg-gray-500';
});

const eventNameInitial = computed(() => {
    return props.event.name.charAt(0).toLocaleUpperCase();
});
</script>

<style scoped></style>