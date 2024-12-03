<template>
    <Card class="max-w-sm mx-auto" :class="{ 'bg-green-500': attendingEvent }">
        <CardContent class="py-5 px-4">
            <div class="grid grid-cols-[1fr_auto] items-center" v-if="guest">
                <p class="text-sm font-medium leading-none">
                    {{ guest.name }}
                </p>
                <div :class="cn('justify-self-end')">
                    <slot></slot>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Guest } from '@/models/Guest';

const props = defineProps<{
    guest?: Guest;
    attendingEvent?: Boolean;
}>();

</script>