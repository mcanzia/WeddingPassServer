<template>
    <Card class="max-w-sm mx-auto">
        <CardContent class="py-5 px-4">
            <div class="grid grid-cols-[1fr_auto] items-center" v-if="hotel">
                <div>
                    <h1 class="text-md font-bold">{{ hotel.name }}</h1>
                    <div class="ml-6 mt-2">
                        <h2 class="text-sm">Address: {{ hotel.location }}</h2>
                    </div>
                </div>
                <div class="justify-self-end">
                    <IconButton icon="pencil-outline" @click="editHotel"></IconButton>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Hotel } from '@/models/Hotel';
import IconButton from '@/components/common/IconButton.vue';

const props = defineProps<{
    hotel?: Hotel;
}>();

const emits = defineEmits(['editHotel']);

function editHotel() {
    emits('editHotel');
}

</script>