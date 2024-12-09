<template>
    <Card class="w-[90vw] justify-self-center bg-[#fff7e7]">
        <CardHeader class="flex flex-col items-center justify-center">
            <p class="w-[75vw] text-center">Please visit this page closer to the wedding day to see event details
                and access your personalized information for the wedding.</p>
        </CardHeader>
        <CardContent>

        </CardContent>
    </Card>
</template>

<script setup>
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const { goToRouteSecured } = useRouterHelper();

function goToSurvey() {
    goToRouteSecured('guest-surveys')
}
</script>