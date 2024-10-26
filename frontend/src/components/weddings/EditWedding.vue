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
                        <Input id="wedding-name" type="text" v-model="editWeddingForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="date">Date</Label>
                        <Input id="date" type="date" v-model="editWeddingForm.date" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="location">Location</Label>
                        <Input id="location" type="text" v-model="editWeddingForm.location" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="updateWedding">Save</Button>
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
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { Wedding } from '@/models/Wedding';
import { WeddingService } from '@/services/WeddingService';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const props = defineProps<{
    weddingId: string;
}>();

const {goToRoute} = useRouterHelper(); 
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority } = storeToRefs(userStore);

onMounted(async () => {
    const weddingService = new WeddingService();
    const editWedding = await weddingService.getWeddingById(props.weddingId);

    if (!editWedding) {
        console.log('Target wedding not found');
    }

    editWeddingForm.value.id = props.weddingId;
    editWeddingForm.value.name = editWedding.name;
    editWeddingForm.value.date = editWedding.date;
    editWeddingForm.value.location = editWedding.location;
    editWeddingForm.value.ownerId = editWedding.ownerId;
});

const editWeddingForm = ref({
    id: '',
    name: '',
    date: '',
    location: '',
    ownerId: ''
});

async function updateWedding() {
    if (hasEditAuthority) {
        const updatedWeddingDetails: Wedding = {
            ...editWeddingForm.value,
            date: new Date(editWeddingForm.value.date)
        }
        const weddingService = new WeddingService();
        await weddingService.updateWedding(updatedWeddingDetails);
        setMessage('Updated wedding.', NotificationType.SUCCESS);
        close()
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }

}

function close() {
    goToRoute('weddings');
}

</script>