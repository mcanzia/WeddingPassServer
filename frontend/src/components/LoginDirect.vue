<template>
    <div class="flex flex-col items-center justify-center h-screen w-screen bg-inherit">
        <div class="flex flex-col gap-5 w-[85vw] max-w-[500px]">
            <Card>
                <CardContent class="mt-5 w-full">
                    <Button class="w-full" @click="directToAdminLogin">Admin Login</Button>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="mt-5 w-full">
                    <Button class="w-full" @click="directToGuestLogin">Guest Login</Button>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import Button from '@/components//ui/button/Button.vue';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { Card, CardContent } from '@/components/ui/card';

const { goToRoute } = useRouterHelper();

function directToAdminLogin() {
    goToRoute('login');
}

function directToGuestLogin() {
    goToRoute('guest-login');
}
</script>