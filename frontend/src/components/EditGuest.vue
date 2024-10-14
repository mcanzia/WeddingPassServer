<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Editing Guest 
                </CardTitle>
                <CardDescription>
                    Enter guest details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="name">Name</Label>
                        <Input id="name" type="text" v-model="editUserForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="email">Email</Label>
                        <Input id="email" type="email" v-model="editUserForm.email" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="phone">Phone</Label>
                        <Input id="phone" type="phone" v-model="editUserForm.phone" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="events">Events</Label>
                        <ToggleGroup type="multiple" variant="outline" class="grid grid-cols-2 sm:grid-cols-3 gap-2"
                            v-model="editUserForm.events">
                            <ToggleGroupItem v-for="weddingEvent in weddingEvents" :value="weddingEvent.id!" :key="weddingEvent.id">
                                {{ weddingEvent.name }}
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="updateGuest">Save</Button>
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

const props = defineProps<{
    guestId: string;
}>();

const router = useRouter();

onMounted(async () => {
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();

    const guestService = new GuestService();
    const editGuest = await guestService.getGuestById(props.guestId);

    if (!editGuest.value) {
        console.log('Target guest not found');
    }

    editUserForm.value.id = props.guestId;
    editUserForm.value.name = editGuest.name;
    editUserForm.value.email = editGuest.email;
    editUserForm.value.phone = editGuest.phone;
    editUserForm.value.events = editGuest.events.map((event: { id: any; }) => event.id);
});

const weddingEvents = ref<WeddingEvent[]>([]);

const editUserForm = ref<{
    id: string;
    name: string;
    email: string;
    phone: string;
    events: string[];
}>({
    id: '',
    name: '',
    email: '',
    phone: '',
    events: []
});

async function updateGuest() {
    const updatedGuestDetails : Guest = {
        ...editUserForm.value,
        events: editUserForm.value.events.map(eventId => weddingEvents.value.find(wedEvent => wedEvent.id === eventId) as WeddingEvent)
    }
    const guestService = new GuestService();
    await guestService.updateGuest(updatedGuestDetails);
    router.push('/guests');
}

function cancel() {
    router.push('/guests');
}


</script>