<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm" v-if="!loading">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Hotel Details
                </CardTitle>
                <CardDescription>
                    Enter hotel details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="hotel-name">Hotel Name</Label>
                        <Input id="hotel-name" type="text" v-model="hotelForm.name" required />
                    </div>
                    <div class="grid gap-2">
                        <Label for="hotel-location">Address</Label>
                        <Input id="hotel-location" type="text" v-model="hotelForm.location" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveHotel">Save</Button>
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
import { Hotel } from '@/models/Hotel';
import { HotelService } from '@/services/HotelService';
import { useRoute } from 'vue-router';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedEvent } = storeToRefs(userStore);

const route = useRoute();
const hotelId = route.params.hotelId as string;

const loading = ref(false);

const hotelForm = ref({
    id: '',
    eventId: '',
    name: '',
    location: '',
});

onMounted(async () => {
    if (hotelId) {
        loading.value = true;

        const hotelService = new HotelService();
        const editHotel = await hotelService.getHotelById(hotelId);

        if (!editHotel) {
            console.log('Target hotel not found');
        }

        hotelForm.value.id = hotelId;
        hotelForm.value.eventId = editHotel.eventId;
        hotelForm.value.name = editHotel.name;
        hotelForm.value.location = editHotel.location;
        loading.value = false;
    }
});

async function saveHotel() {
    if (hasEditAuthority) {
        const hotelToUpdate = {
            ...hotelForm.value,
            eventId: selectedEvent.value?.id!,
        } as Hotel
        const hotelService = new HotelService();
        await hotelService.saveHotel(hotelToUpdate);
        setMessage('Updated hotel.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRouteSecured('hotels');
}


</script>