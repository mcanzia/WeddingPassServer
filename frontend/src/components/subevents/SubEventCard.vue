<template>
    <Card class="max-w-sm mx-auto">
        <CardContent class="py-5 px-4">
            <div class="grid grid-cols-[1fr_auto] items-center" v-if="subEvent">
                <div>
                    <h1 class="text-md font-bold">{{ subEvent.name }} ({{ subEvent.order }})</h1>
                </div>
                <div class="justify-self-end">
                    <IconButton icon="pencil-outline" @click="editSubEvent"></IconButton>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { SubEvent } from '@/models/SubEvent';
import IconButton from '@/components/common/IconButton.vue';

const props = defineProps<{
    subEvent?: SubEvent;
}>();

const emits = defineEmits(['editSubEvent']);

function editSubEvent() {
    emits('editSubEvent');
}

</script>