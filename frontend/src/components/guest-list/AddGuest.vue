<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Add Guest
                </CardTitle>
                <CardDescription>
                    Enter guest details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="first-name">First Name</Label>
                        <Input id="first-name" type="text" v-model="newUserForm.firstName" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="last-name">Last Name</Label>
                        <Input id="last-name" type="text" v-model="newUserForm.lastName" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" v-model="newUserForm.email" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="phone">Phone</Label>
                        <Input id="phone" type="phone" v-model="newUserForm.phone" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="events">Events</Label>
                        <ToggleGroup type="multiple" variant="outline" class="grid grid-cols-2 sm:grid-cols-3 gap-2"
                            v-model="newUserForm.events">
                            <ToggleGroupItem v-for="weddingEvent in weddingEvents" :value="weddingEvent.id!" :key="weddingEvent.id">
                                {{ weddingEvent.name }}
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveGuest">Save</Button>
                        <Button @click="cancel" variant="outline">Cancel</Button>
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { GuestService } from '@/services/GuestService';
import { EventService } from '@/services/EventService';
import { WeddingEvent } from '@/models/WeddingEvent';
import { Guest } from '@/models/Guest';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';

const router = useRouter();
const notificationStore = useNotificationStore();
const {setMessage} = notificationStore;

onMounted(async () => {
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();
});

const weddingEvents = ref<WeddingEvent[]>([]);

const newUserForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    events: []
});

async function saveGuest() {
    const newGuest : Guest = {
        name: `${newUserForm.value.firstName} ${newUserForm.value.lastName}`,
        email: newUserForm.value.email,
        phone: newUserForm.value.phone,
        attendingEvents: [],
        events: newUserForm.value.events.map(eventId => weddingEvents.value.find(wedEvent => wedEvent.id === eventId) as WeddingEvent)
    }
    const guestService = new GuestService();
    await guestService.addGuest(newGuest);
    setMessage('Added user.', NotificationType.SUCCESS);
    router.push('/guests');
}

function cancel() {
    router.push('/guests');
}


</script>