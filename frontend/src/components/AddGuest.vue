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
                            <ToggleGroupItem value="Mehendi">
                                Mehendi
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Haldi">
                                Haldi
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Sangeet">
                                Sangeet
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Morning Ceremony">
                                Morning Ceremony
                            </ToggleGroupItem>
                            <ToggleGroupItem value="Evening Ceremony">
                                Evening Ceremony
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { GuestService } from '@/services/GuestService';

const router = useRouter();

const newUserForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    events: []
});

async function saveGuest() {
    const newGuest = {
        name: `${newUserForm.value.firstName} ${newUserForm.value.lastName}`,
        email: newUserForm.value.email,
        phone: newUserForm.value.phone,
        events: newUserForm.value.events
    }
    const guestService = new GuestService();
    await guestService.addGuest(newGuest);
    router.push('/guests');
}

function cancel() {
    router.push('/guests');
}


</script>