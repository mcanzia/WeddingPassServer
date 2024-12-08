<template>
    <Card class="w-[90vw] justify-self-center bg-[#fff7e7]">
        <CardHeader class="flex flex-col items-center justify-center">
            <CardTitle class="text-2xl uppercase italic">
                Guests In Party
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-4 gap-4 text-center uppercase underline">
                <div>Name</div>
                <div>Hotel</div>
                <div>Room Number</div>
                <div>Events</div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
</script>