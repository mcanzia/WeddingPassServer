<template>
  <div class="flex-1 mt-5 max-w-sm">
    <Card class="mx-auto flex flex-col hover:bg-slate-100">
      <CardHeader class="flex-none">
        <CardTitle class="text-2xl">
          {{ weddingRole.wedding.name }}
        </CardTitle>
        <span class="italics"> {{ startCase(weddingRole.role) }}</span>
        <Separator />
      </CardHeader>
      <CardContent class="flex-1 overflow-y-auto">
        <div class="flex gap-3 justify-center items-center">
          <ion-icon name="calendar"></ion-icon>
          <span>{{ weddingDateComputed }}</span>
        </div>
        <div class="flex gap-3 justify-center items-center">
          <ion-icon name="location"></ion-icon>
          <span>{{ weddingRole.wedding.location }}</span>
        </div>

      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Wedding } from "@/models/Wedding";
import { WeddingRole } from "@/models/WeddingRole";
import { computed } from "vue";
import { startCase } from "lodash";

const props = defineProps<{
  weddingRole: WeddingRole;
}>();

const weddingDateComputed = computed(() => {
  return props.weddingRole && props.weddingRole.wedding
    ? new Date(props.weddingRole.wedding.date).toDateString()
    : "";
});
</script>