<template>
  <div class="flex-1 mt-5 max-w-sm">
    <Card class="mx-auto flex flex-col hover:bg-slate-100">
      <CardHeader class="flex-none">
        <CardTitle class="text-2xl">
          {{ eventRole.event.name }}
        </CardTitle>
        <span class="italics"> {{ startCase(eventRole.role) }}</span>
        <Separator />
      </CardHeader>
      <CardContent class="flex-1 overflow-y-auto">
        <div class="flex gap-3 justify-center items-center">
          <ion-icon name="calendar"></ion-icon>
          <span>{{ eventDateComputed }}</span>
        </div>
        <div class="flex gap-3 justify-center items-center">
          <ion-icon name="location"></ion-icon>
          <span>{{ eventRole.event.location }}</span>
        </div>

      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Event } from "@/models/Event";
import { EventRole } from "@/models/EventRole";
import { computed } from "vue";
import { startCase } from "lodash";

const props = defineProps<{
  eventRole: EventRole;
}>();

const eventDateComputed = computed(() => {
  return props.eventRole && props.eventRole.event
    ? new Date(props.eventRole.event.date).toDateString()
    : "";
});
</script>