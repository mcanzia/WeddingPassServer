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
                        <Input id="event-name" type="text" v-model="newEventForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="date">Date</Label>
                        <Input id="date" type="date" v-model="newEventForm.date" required />
                    </div>
                    <!--Look into using vue-3-google-map for location field-->
                    <div class="grid gap-2">
                        <Label for="location">Location</Label>
                        <Input id="location" type="text" v-model="newEventForm.location" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveEvent">Save</Button>
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
import { Event } from '@/models/Event';
import { EventService } from '@/services/EventService';
import { useRouterHelper } from '@/util/composables/useRouterHelper';

const { goToRoute } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, localUser } = storeToRefs(userStore);

const newEventForm = ref({
    name: '',
    date: '',
    location: ''
});

async function saveEvent() {
    if (hasEditAuthority && localUser.value) {
        const newEvent: Event = {
            name: newEventForm.value.name,
            date: new Date(newEventForm.value.date),
            location: newEventForm.value.location,
            ownerId: localUser.value.id
        };
        const eventService = new EventService();
        await eventService.saveEvent(newEvent);
        setMessage('Added event.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRoute('events');
}


</script>