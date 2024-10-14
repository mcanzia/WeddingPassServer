<template>
    <Card class="max-w-sm mx-auto" :class="{ 'bg-green-500': isAttending }">
        <CardContent class="py-5 px-4">
            <div class="grid grid-cols-[1fr_auto] items-center" v-if="guest">
                <p class="text-sm font-medium leading-none">
                    {{ guest.name }}
                </p>
                <div class="justify-self-end">
                    <ConfirmAction 
                        alert-title="Do you want to remove Attending status for this guest?" 
                        @on-confirm="removeAttending"
                        v-if="attendingEvent"
                    >
                        <Badge class="cursor-pointer">
                            {{ attendingText }}
                        </Badge>
                    </ConfirmAction>
                    <Badge v-else @click="addAttending" class="cursor-pointer">
                        {{ attendingText }}
                    </Badge>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { Guest } from '@/models/Guest';
import { Badge } from '@/components/ui/badge'
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';
import { computed } from 'vue';

const props = defineProps<{
    guest?: Guest;
    attendingEvent?: Boolean;
}>();

const emit = defineEmits(['addAttending', 'removeAttending']);

const isAttending = computed(() => {
    return props.attendingEvent;
});

const attendingText = computed(() => {
    return props.attendingEvent ? 'Attending' : 'Invited';
});

function addAttending() {
    emit('addAttending');
}

function removeAttending() {
    emit('removeAttending');
}

</script>