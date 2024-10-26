<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Add Wedding
                </CardTitle>
                <CardDescription>
                    Enter wedding details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="wedding-name">Wedding Name</Label>
                        <Input id="wedding-name" type="text" v-model="newWeddingForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="date">Date</Label>
                        <Input id="date" type="date" v-model="newWeddingForm.date" required />
                    </div>
                    <!--Look into using vue-3-google-map for location field-->
                    <div class="grid gap-2">
                        <Label for="location">Location</Label>
                        <Input id="location" type="text" v-model="newWeddingForm.location" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveWedding">Save</Button>
                        <Button @click="close" variant="outline">Cancel</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ref } from 'vue';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { Wedding } from '@/models/Wedding';
import { WeddingService } from '@/services/WeddingService';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const {goToRoute} = useRouterHelper(); 
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, user } = storeToRefs(userStore);

const newWeddingForm = ref({
    name: '',
    date: '',
    location: ''
});

async function saveWedding() {
    if (hasEditAuthority) {
        const newWedding: Wedding = {
            name: newWeddingForm.value.name,
            date: new Date(newWeddingForm.value.date),
            location: newWeddingForm.value.location,
            ownerId: user.value.id
        };
        const weddingService = new WeddingService();
        await weddingService.addWedding(newWedding);
        setMessage('Added wedding.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRoute('weddings');
}


</script>