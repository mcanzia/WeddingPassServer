<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto max-w-sm" v-if="!loading">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Accommodation Details
                </CardTitle>
                <CardDescription>
                    Enter accommodation details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="grid gap-2">
                        <Label for="accommodation-name">Accommodation Name</Label>
                        <Input id="accommodation-name" type="text" v-model="accommodationForm.name" required />
                    </div>
                    <div>
                        <Label for="accommodation-type">Accommodation Type</Label>
                        <SingleSelectDropdown id="accommodation-type" v-model="accommodationForm.type"
                            :selectOptions="accommodationTypeOptions">
                        </SingleSelectDropdown>
                    </div>
                    <div class="grid gap-2">
                        <Label for="accommodation-location">Address</Label>
                        <Input id="accommodation-location" type="text" v-model="accommodationForm.location" required />
                    </div>
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveAccommodation">Save</Button>
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
import { ref, onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import Loader from '@/components/Loader.vue';
import { Accommodation } from '@/models/Accommodation';
import { useRoute } from 'vue-router';
import { AccommodationService } from '@/services/AccommodationService';
import SingleSelectDropdown from '@/components/common/SingleSelectDropdown.vue';

import { AccommodationType } from '@/models/AccommodationType';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedEvent } = storeToRefs(userStore);

const route = useRoute();
const accommodationId = route.params.accommodationId as string;

const loading = ref(false);

const accommodationForm = ref({
    id: '',
    eventId: '',
    type: '',
    name: '',
    location: '',
});

onMounted(async () => {
    if (accommodationId) {
        loading.value = true;

        const accommodationService = new AccommodationService();
        const editAccommodation = await accommodationService.getAccommodationById(accommodationId);

        if (!editAccommodation) {
            console.log('Target accommodation not found');
        }

        accommodationForm.value.id = accommodationId;
        accommodationForm.value.eventId = editAccommodation.eventId;
        accommodationForm.value.type = editAccommodation.type;
        accommodationForm.value.name = editAccommodation.name;
        accommodationForm.value.location = editAccommodation.location;
        loading.value = false;
    }
});

const accommodationTypeOptions = computed(() => {
    return Object.keys(AccommodationType);
})

async function saveAccommodation() {
    if (hasEditAuthority) {
        const accommodationToUpdate = {
            ...accommodationForm.value,
            eventId: selectedEvent.value?.id!,
        } as Accommodation
        const accommodationService = new AccommodationService();
        await accommodationService.saveAccommodation(accommodationToUpdate);
        setMessage('Updated accommodation.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRouteSecured('accommodations');
}


</script>