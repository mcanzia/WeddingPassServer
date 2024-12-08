<template>
    <Card class="w-[90vw] justify-self-center bg-[#fff7e7]">
        <CardHeader class="flex flex-col items-center justify-center">
            <CardTitle class="text-2xl uppercase italic">
                Guests In Party
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div class="grid grid-cols-4 gap-4 text-center uppercase underline">
                <div>Name</div>
                <div>Hotel</div>
                <div>Room Number</div>
                <div>Events</div>
            </div>
            <div class="grid grid-cols-4 mt-4 gap-4 text-center uppercase" v-for="guest in partyMembers"
                :key="guest.id">
                <div>{{ guest.name }}</div>
                <div>{{ guest.accommodation?.hotel.name }}</div>
                <div>{{ guest.accommodation?.roomNumber || 'To Be Assigned' }}</div>
                <div>{{ guest.events.map(event => event.name).join(',') }}</div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Guest } from '@/models/Guest';
import { GuestService } from '@/services/GuestService';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';

const userStore = useUserStore();
const { loggedInGuest } = storeToRefs(userStore);

const partyMembers = ref<Guest[]>([]);
const loading = ref<boolean>(false);

onMounted(async () => {
    loading.value = true;
    const guestService = new GuestService();
    partyMembers.value = await guestService.fetchPartyMembers(loggedInGuest.value);
    loading.value = false;
});

</script>