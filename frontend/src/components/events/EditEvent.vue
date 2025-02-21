<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Add Event
                </CardTitle>
                <CardDescription>
                    Enter event details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="event-name">Event Name</Label>
                        <Input id="event-name" type="text" v-model="editEventForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="date">Date</Label>
                        <Input id="date" type="date" v-model="editEventForm.date" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="location">Location</Label>
                        <Input id="location" type="text" v-model="editEventForm.location" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="updateEvent">Save</Button>
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
import { Event } from '@/models/Event';
import { EventService } from '@/services/EventService';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const props = defineProps<{
    eventId: string;
}>();

const { goToRoute } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority } = storeToRefs(userStore);

onMounted(async () => {
    const eventService = new EventService();
    const editEvent = await eventService.getEventById(props.eventId);

    if (!editEvent) {
        console.log('Target event not found');
    }

    editEventForm.value.id = props.eventId;
    editEventForm.value.name = editEvent.name;
    editEventForm.value.date = editEvent.date;
    editEventForm.value.location = editEvent.location;
    editEventForm.value.ownerId = editEvent.ownerId;
});

const editEventForm = ref({
    id: '',
    name: '',
    date: '',
    location: '',
    ownerId: ''
});

async function updateEvent() {
    if (hasEditAuthority) {
        const updatedEventDetails: Event = {
            ...editEventForm.value,
            date: new Date(editEventForm.value.date)
        }
        const eventService = new EventService();
        await eventService.updateEvent(updatedEventDetails);
        setMessage('Updated event.', NotificationType.SUCCESS);
        close()
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }

}

function close() {
    goToRoute('events');
}

</script>