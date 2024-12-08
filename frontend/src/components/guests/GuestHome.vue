<template>
  <Card class="w-[90vw] justify-self-center bg-[#fff7e7]">
    <CardHeader class="flex flex-col items-center justify-center">
      <p class="w-[75vw] text-center">We are so excited to celebrate with you! We need your help
        with providing
        more details to help
        us be the best
        hosts possible. Please fill out the short survey with your preferences and travel arrangements.</p>
      <Button class="w-[40vw] bg-[#a5282b] uppercase mt-3" @click="goToSurvey">Start Survey</Button>
      <img src="/images/engage.jpg" alt="Guest Home Picture" class="mt-3 w-auto h-auto max-w-xs object-contain" />
    </CardHeader>
    <CardContent>

    </CardContent>
  </Card>
</template>

<script setup>
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const { goToRouteSecured } = useRouterHelper();

function goToSurvey() {
  goToRouteSecured('guest-surveys')
}
</script>