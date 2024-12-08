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
                <div class="grid grid-cols-3 gap-4">
                    <div class="grid gap-4">
                        <div>
                            <Label for="guest-name">Guest Name</Label>
                            <Input id="guest-name" type="text" v-model="newUserForm.name" required />
                        </div>
                        <div>
                            <Label for="partyNum">Party Number</Label>
                            <Input id="partyNum" type="number" v-model="newUserForm.groupNumber" required />
                        </div>
                        <div>
                            <Label for="email">Email</Label>
                            <Input id="email" type="email" v-model="newUserForm.email" required />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <PhoneInput v-model="newUserForm.phone" required
                                :preferred-countries="['IN', 'US', 'IT', 'GB', 'JP', 'CA']" />
                        </div>
                        <div>
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
                        <div>
                            <Label for="arrival-type">Arrival Type</Label>
                            <SingleSelectDropdown id="arrival-type" v-model="newUserForm.arrival.type"
                                @update:modelValue="clearArrivalTransport" :selectOptions="transportationTypeOptions">
                            </SingleSelectDropdown>
                        </div>
                        <div>
                            <Label for="arrival-time">Arrival Time</Label>
                            <DateTimeInput :disabled="!newUserForm.arrival.type" id="arrival-time"
                                v-model="arrivalTimeComputed"></DateTimeInput>
                        </div>
                        <div>
                            <Label for="arrival-number">Arrival Flight/Train Number</Label>
                            <Input id="arrival-number" type="text" :disabled="!newUserForm.arrival.type"
                                v-model="arrivalNumberComputed" required />
                        </div>
                        <div>
                            <Label for="departure-type">Departure Type</Label>
                            <SingleSelectDropdown id="departure-type" v-model="newUserForm.departure.type"
                                @update:modelValue="clearDepartureTransport" :selectOptions="transportationTypeOptions">
                            </SingleSelectDropdown>
                        </div>
                        <div>
                            <Label for="departure-time">Departure Time</Label>
                            <DateTimeInput :disabled="!newUserForm.departure.type" id="departure-time"
                                v-model="departureTimeComputed"></DateTimeInput>
                        </div>
                        <div>
                            <Label for="departure-number">Departure Flight/Train Number</Label>
                            <Input id="departure-number" type="text" :disabled="!newUserForm.departure.type"
                                v-model="departureNumberComputed" required />
                        </div>
                    </div>
                    <div class="grid gap-4">
                        <div>
                            <Label for="hotel">Hotel</Label>
                            <SingleSelectDropdown id="hotel" v-model="newUserForm.accommodation.hotel" fieldKey="name"
                                :selectOptions="hotels as unknown as Record<string, unknown>[]">
                            </SingleSelectDropdown>
                        </div>
                        <div>
                            <Label for="room-number">Room Number</Label>
                            <Input id="room-number" type="text" v-model="newUserForm.accommodation.roomNumber"
                                required />
                        </div>
                        <div>
                            <Label for="dietary-restrictions">Dietary Restrictions</Label>
                            <Textarea id="dietary-restrictions" v-model="newUserForm.dietaryRestrictions"></Textarea>
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
import { useRoute } from 'vue-router';
import Textarea from '../ui/textarea/Textarea.vue';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedWedding } = storeToRefs(userStore);

const route = useRoute();
const guestId = route.params.guestId as string;

const loading = ref(false);
const weddingEvents = ref<WeddingEvent[]>([]);
const hotels = ref<Hotel[]>([]);

onMounted(async () => {
    loading.value = true;
    const eventService = new EventService();
    weddingEvents.value = await eventService.getAllEvents();
    const hotelService = new HotelService();
    hotels.value = await hotelService.getAllHotels();
    if (guestId) {
        const guestSerice = new GuestService();
        const editGuest = await guestSerice.getGuestById(guestId);

        if (!editGuest) {
            console.log('Target guest not found');
            return;
        }

        newUserForm.value.id = guestId;
        newUserForm.value.weddingId = editGuest.weddingId;
        newUserForm.value.name = editGuest.name;
        newUserForm.value.groupNumber = editGuest.groupNumber;
        newUserForm.value.email = editGuest.email;
        newUserForm.value.phone = editGuest.phone;
        newUserForm.value.serialNumber = editGuest.serialNumber;
        newUserForm.value.events = editGuest.events.map((event: { id: any; }) => event.id);
        newUserForm.value.attendingEvents = editGuest.attendingEvents;
        newUserForm.value.dietaryRestrictions = editGuest.dietaryRestrictions;
        if (editGuest.arrival) {
            newUserForm.value.arrival = editGuest.arrival;
        }
        if (editGuest.departure) {
            newUserForm.value.departure = editGuest.departure;
        }
        if (editGuest.accommodation) {
            newUserForm.value.accommodation = editGuest.accommodation;
        }
    }
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
        flightNumber: '',
        trainTime: '',
        trainNumber: '',
    },
    departure: {
        type: '',
        flightTime: '',
        flightNumber: '',
        trainTime: '',
        trainNumber: ''
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

const arrivalNumberComputed = computed({
    get() {
        if (newUserForm.value.arrival) {
            switch (newUserForm.value.arrival.type) {
                case TransportationType.FLIGHT: {
                    return newUserForm.value.arrival.flightNumber;
                }
                case TransportationType.TRAIN: {
                    return newUserForm.value.arrival.trainNumber;
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
                    newUserForm.value.arrival.flightNumber = val;
                    break;
                }
                case TransportationType.TRAIN: {
                    newUserForm.value.arrival.trainNumber = val;
                    break;
                }
            }
        }
    }
});

const departureNumberComputed = computed({
    get() {
        if (newUserForm.value.departure) {
            switch (newUserForm.value.departure.type) {
                case TransportationType.FLIGHT: {
                    return newUserForm.value.departure.flightNumber;
                }
                case TransportationType.TRAIN: {
                    return newUserForm.value.departure.trainNumber;
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
                    newUserForm.value.departure.flightNumber = val;
                    break;
                }
                case TransportationType.TRAIN: {
                    newUserForm.value.departure.trainNumber = val;
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

function clearArrivalTransport() {
    if (!newUserForm.value.arrival) {
        return;
    }

    newUserForm.value.arrival = {
        ...newUserForm.value.arrival,
        trainTime: '',
        trainNumber: '',
        flightNumber: '',
        flightTime: ''
    }
}

function clearDepartureTransport() {
    if (!newUserForm.value.departure) {
        return;
    }

    newUserForm.value.departure = {
        ...newUserForm.value.departure,
        trainTime: '',
        trainNumber: '',
        flightNumber: '',
        flightTime: ''
    }
}

async function saveGuest() {
    if (hasEditAuthority) {
        const newGuest = {
            ...newUserForm.value,
            weddingId: selectedWedding.value?.id!,
            events: newUserForm.value.events.map(eventId => weddingEvents.value.find(wedEvent => wedEvent.id === eventId) as WeddingEvent),
        } as Guest;
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