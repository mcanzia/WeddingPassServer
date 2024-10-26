<template>
    <div class="flex-1 mt-5 max-w-sm">
      <Card class="mx-auto flex flex-col hover:bg-slate-700">
        <CardHeader class="flex-none">
          <CardTitle class="text-2xl">
            {{ wedding.name }}
          </CardTitle>
          <Separator />
        </CardHeader>
        <CardContent class="flex-1 overflow-y-auto">
            <div class="flex gap-3 justify-center items-center">
                <ion-icon name="calendar"></ion-icon>
                <span>{{ weddingDateComputed }}</span>
            </div>
            <div class="flex gap-3 justify-center items-center">
                <ion-icon name="location"></ion-icon>
                <span>{{ wedding.location }}</span>
            </div>

        </CardContent>
      </Card>
    </div>
  </template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { Wedding } from '@/models/Wedding';
import { computed } from 'vue';

const props = defineProps<{
    wedding: Wedding;
}>();

const weddingDateComputed = computed(() => {
    return props.wedding ? new Date(props.wedding.date).toDateString() : '';
});






</script>