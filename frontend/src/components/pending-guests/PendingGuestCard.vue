<template>
    <Card class="max-w-sm mx-auto">
        <CardContent class="py-5 px-4">
            <div class="grid grid-cols-[1fr_auto] items-center" v-if="pendingGuest">
                <div>
                    <h1 class="text-md font-bold">{{ pendingGuest.guestName }}</h1>
                    <div class="ml-6 mt-2">
                        <h2 class="text-sm">Email: {{ pendingGuest.email }}</h2>
                        <h2 class="text-sm mt-1">Phone: {{ pendingGuest.phone }}</h2>
                    </div>
                </div>
                <div class="justify-self-end">
                    <IconButton icon="link-outline" @click="linkPendingGuestAccount"></IconButton>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent } from '@/components/ui/card';
import { PendingGuest } from '@/models/PendingGuest';
import IconButton from '@/components/common/IconButton.vue';


defineProps<{
    pendingGuest?: PendingGuest;
}>();

const emit = defineEmits(['linkGuest']);

function linkPendingGuestAccount() {
    emit('linkGuest');
}


</script>