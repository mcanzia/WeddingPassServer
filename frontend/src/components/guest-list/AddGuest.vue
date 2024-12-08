<template>
    <div class="flex-1 mt-5 h-screen w-screen">
        <Card class="mx-auto w-[85vw]" v-if="!loading">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Guest Details
                </CardTitle>
                <CardDescription>
                    Enter guest details below
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid grid-cols-2 gap-4">
                    <div class="grid gap-4">
                        <div class="grid gap-2">
                            <Label for="guest-name">Guest Name</Label>
                            <Input id="guest-name" type="text" v-model="newUserForm.name" required />
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
                    </div>
                    <div class="grid gap-4">
                        <div class="grid gap-2">
                            <Label for="arrival-type">Arrival Type</Label>
                            <SingleSelectDropdown id="arrival-type" v-model="newUserForm.arrival.type"
                                @update:modelValue="clearTimeFields" :selectOptions="transportationTypeOptions">
                            </SingleSelectDropdown>
                        </div>
                        <div class="grid gap-2">
                            <Label for="arrival-time">Arrival Time</Label>
                            <DateTimeInput :disabled="!newUserForm.arrival.type" id="arrival-time"
                                v-model="arrivalTimeComputed"></DateTimeInput>
                        </div>
                        <div class="grid gap-2">
                            <Label for="departure-type">Departure Type</Label>
                            <SingleSelectDropdown id="departure-type" v-model="newUserForm.departure.type"
                                @update:modelValue="clearTimeFields" :selectOptions="transportationTypeOptions">
                            </SingleSelectDropdown>
                        </div>
                        <div class="grid gap-2">
                            <Label for="departure-time">Departure Time</Label>
                            <DateTimeInput :disabled="!newUserForm.departure.type" id="departure-time"
                                v-model="departureTimeComputed"></DateTimeInput>
                        </div>
                        <div class="grid gap-2">
                            <Label for="hotel">Hotel</Label>
                            <SingleSelectDropdown id="hotel" v-model="newUserForm.accommodation.hotel" fieldKey="name"
                                :selectOptions="hotels as unknown as Record<string, unknown>[]">
                            </SingleSelectDropdown>
                        </div>
                        <div class="grid gap-2">
                            <Label for="room-number">Room Number</Label>
                            <Input id="room-number" type="text" v-model="newUserForm.accommodation.roomNumber"
                                required />
                        </div>
                    </div>
                </div>
                <div class="inline-flex gap-4 mt-4 justify-end">
                    <Button @click="saveGuest">Save</Button>
                    <Button @click="close" variant="outline">Cancel</Button>
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ref, onMounted, computed } from 'vue';
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
import Loader from '@/components/Loader.vue';
import { TransportationType } from '@/models/TransportationType';
import SingleSelectDropdown from '@/components/common/SingleSelectDropdown.vue';
import DateTimeInput from '@/components/common/DateTimeInput.vue';
import { Hotel } from '@/models/Hotel';
import { HotelService } from '@/services/HotelService';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedWedding } = storeToRefs(userStore);

const loading = ref(false);
const weddingEvents = ref<WeddingEvent[]>([]);
const hotels = ref<Hotel[]>([]);

onMounted(async () => {
    loading.value = true;
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();
    const hotelService = new HotelService();
    hotels.value = await hotelService.getAllHotels();
    loading.value = false;
});

const newUserForm = ref({
    id: '',
    weddingId: '',
    groupNumber: 0,
    name: '',
    email: '',
    phone: '',
    serialNumber: '',
    events: [],
    attendingEvents: [],
    arrival: {
        type: '',
        flightTime: '',
        trainTime: ''
    },
    departure: {
        type: '',
        flightTime: '',
        trainTime: ''
    },
    dietaryRestrictions: '',
    accommodation: {
        hotel: {} as Hotel,
        roomNumber: ''
    }
});

const transportationTypeOptions = computed(() => {
    return Object.keys(TransportationType);
});

const arrivalTimeComputed = computed({
    get() {
        if (newUserForm.value.arrival) {
            switch (newUserForm.value.arrival.type) {
                case TransportationType.FLIGHT: {
                    return newUserForm.value.arrival.flightTime;
                }
                case TransportationType.TRAIN: {
                    return newUserForm.value.arrival.trainTime;
                }
                default: {
                    return ''
                }
            }
        }
        return '';
    },
    set(val) {
        if (newUserForm.value.arrival) {
            switch (newUserForm.value.arrival.type) {
                case TransportationType.FLIGHT: {
                    newUserForm.value.arrival.flightTime = val;
                    break;
                }
                case TransportationType.TRAIN: {
                    newUserForm.value.arrival.trainTime = val;
                    break;
                }
            }
        }
    }
});

const departureTimeComputed = computed({
    get() {
        if (newUserForm.value.departure) {
            switch (newUserForm.value.departure.type) {
                case TransportationType.FLIGHT: {
                    return newUserForm.value.departure.flightTime;
                }
                case TransportationType.TRAIN: {
                    return newUserForm.value.departure.trainTime;
                }
                default: {
                    return ''
                }
            }
        }
        return '';
    },
    set(val) {
        if (newUserForm.value.departure) {
            switch (newUserForm.value.departure.type) {
                case TransportationType.FLIGHT: {
                    newUserForm.value.departure.flightTime = val;
                    break;
                }
                case TransportationType.TRAIN: {
                    newUserForm.value.departure.trainTime = val;
                    break;
                }
            }
        }
    }
});

function clearTimeFields() {
    if (!newUserForm.value.arrival && !newUserForm.value.departure) {
        return;
    }
    if (newUserForm.value.arrival.type === TransportationType.FLIGHT) {
        newUserForm.value.arrival.trainTime = '';
    } else if (newUserForm.value.arrival.type === TransportationType.TRAIN) {
        newUserForm.value.arrival.flightTime = '';
    } else {
        newUserForm.value.arrival.flightTime = '';
        newUserForm.value.arrival.trainTime = '';
    }

    if (newUserForm.value.departure.type === TransportationType.FLIGHT) {
        newUserForm.value.departure.trainTime = '';
    } else if (newUserForm.value.departure.type === TransportationType.TRAIN) {
        newUserForm.value.departure.flightTime = '';
    } else {
        newUserForm.value.departure.flightTime = '';
        newUserForm.value.departure.trainTime = '';
    }

}

async function saveGuest() {
    if (hasEditAuthority) {
        const newGuest: Guest = {
            ...newUserForm.value,
            weddingId: selectedWedding.value?.id!,
            events: newUserForm.value.events.map(eventId => weddingEvents.value.find(wedEvent => wedEvent.id === eventId) as WeddingEvent),
        }
        const guestService = new GuestService();
        await guestService.saveGuest(newGuest);
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