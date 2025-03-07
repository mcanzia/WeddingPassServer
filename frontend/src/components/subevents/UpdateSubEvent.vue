<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm" v-if="!loading">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Sub Event Details
                </CardTitle>
                <CardDescription>
                    Enter sub event details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="sub-event-name">Sub Event Name</Label>
                        <Input id="sub-event-name" type="text" v-model="subEventForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="sub-event-order">Sub Event Order</Label>
                        <Input id="sub-event-order" type="number" v-model="subEventForm.order" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveSubEvent">Save</Button>
                        <Button @click="close" variant="outline">Cancel</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Loader v-else />
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ref, onMounted } from 'vue';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import Loader from '@/components/Loader.vue';
import { SubEvent } from '@/models/SubEvent';
import { SubEventService } from '@/services/SubEventService';
import { useRoute } from 'vue-router';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedEvent } = storeToRefs(userStore);

const route = useRoute();
const subEventId = route.params.subEventId as string;

const loading = ref(false);

const subEventForm = ref({
    id: '',
    eventId: '',
    name: '',
    order: 0
});

onMounted(async () => {
    if (subEventId) {
        loading.value = true;

        const subEventService = new SubEventService();
        const editSubEvent = await subEventService.getSubEventById(subEventId);

        if (!editSubEvent) {
            console.log('Target sub event not found');
        }

        subEventForm.value.id = subEventId;
        subEventForm.value.eventId = editSubEvent.eventId;
        subEventForm.value.name = editSubEvent.name;
        loading.value = false;
    }
});

async function saveSubEvent() {
    if (hasEditAuthority) {
        const subEventToUpdate = {
            ...subEventForm.value,
            eventId: selectedEvent.value?.id!,
        } as SubEvent
        const subEventService = new SubEventService();
        await subEventService.saveSubEvent(subEventToUpdate);
        setMessage('Updated sub event.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRouteSecured('sub-events');
}


</script>