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
                        <Label for="guest-name">Guest Name</Label>
                        <Input id="guest-name" type="text" v-model="newUserForm.guestName" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="partyNum">Party Number</Label>
                        <Input id="partyNum" type="number" v-model="newUserForm.groupNumber" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" v-model="newUserForm.email" required />
                    </div>
                    <div class="grid gap-2">
                        <Label>Phone</Label>
                        <PhoneInput v-model="newUserForm.phone" required initial-country="IN"
                            :preferred-countries="['IN', 'US', 'IT', 'GB', 'JP', 'CA']" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="events">Events</Label>
                        <ToggleGroup type="multiple" variant="outline" class="grid grid-cols-2 sm:grid-cols-3 gap-2"
                            v-model="newUserForm.events">
                            <ToggleGroupItem v-for="weddingEvent in weddingEvents" :value="weddingEvent.id!"
                                :key="weddingEvent.id">
                                {{ weddingEvent.name }}
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveGuest">Save</Button>
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ref, onMounted } from 'vue';
import { GuestService } from '@/services/GuestService';
import { EventService } from '@/services/EventService';
import { WeddingEvent } from '@/models/WeddingEvent';
import { Guest } from '@/models/Guest';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import PhoneInput from '@/components/common/PhoneInput.vue';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedWedding } = storeToRefs(userStore);

onMounted(async () => {
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();
});

const weddingEvents = ref<WeddingEvent[]>([]);

const newUserForm = ref({
    guestName: '',
    groupNumber: 0,
    email: '',
    phone: '',
    groupNumber: 0,
    events: []
});

async function saveGuest() {
    if (hasEditAuthority) {
        const newGuest: Guest = {
            weddingId: selectedWedding.value?.id!,
            name: newUserForm.value.guestName,
            groupNumber: newUserForm.value.groupNumber,
            email: newUserForm.value.email,
            phone: newUserForm.value.phone,
            groupNumber: newUserForm.value.groupNumber,
            attendingEvents: [],
            events: newUserForm.value.events.map(eventId => weddingEvents.value.find(wedEvent => wedEvent.id === eventId) as WeddingEvent),
            weddingId: '',
        }
        const guestService = new GuestService();
        await guestService.addGuest(newGuest);
        setMessage('Added user.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRouteSecured('guests');
}


</script>