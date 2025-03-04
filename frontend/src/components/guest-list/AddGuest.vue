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
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                            <Label for="events">Sub Events</Label>
                            <ToggleGroup type="multiple" variant="outline" class="grid grid-cols-2 sm:grid-cols-3 gap-2"
                                v-model="newUserForm.subEvents">
                                <ToggleGroupItem v-for="subEvent in subEvents" :value="subEvent.id!" :key="subEvent.id">
                                    {{ subEvent.name }}
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
                            <Label for="accommodation">Accommodation</Label>
                            <SingleSelectDropdown id="accommodation" v-model="newUserForm.accommodation" fieldKey="name"
                                :selectOptions="accommodations as unknown as Record<string, unknown>[]">
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
                        <div>
                            <Label for="will-drink-alcohol">Will Drink Alcohol</Label>
                            <SingleSelectDropdown id="will-drink-alcohol" v-model="willDrinkAlcoholComputed"
                                :selectOptions="['TRUE', 'FALSE']">
                            </SingleSelectDropdown>
                        </div>
                        <div>
                            <Label for="drink-preferences">Drink Preferences</Label>
                            <SingleSelectDropdown id="drink-preferences" v-model="chosenDrinkPreferences"
                                :selectOptions="drinkPreferences">
                            </SingleSelectDropdown>
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
import { SubEventService } from '@/services/SubEventService';
import { SubEvent } from '@/models/SubEvent';
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
import { AccommodationService } from '@/services/AccommodationService';
import { useRoute } from 'vue-router';
import Textarea from '../ui/textarea/Textarea.vue';
import { Accommodation } from '@/models/Accommodation';

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, selectedEvent } = storeToRefs(userStore);

const route = useRoute();
const guestId = route.params.guestId as string;

const loading = ref(false);
const subEvents = ref<SubEvent[]>([]);
const accommodations = ref<Accommodation[]>([]);

onMounted(async () => {
    loading.value = true;
    const subEventService = new SubEventService();
    subEvents.value = await subEventService.getAllSubEvents();
    const accommodationService = new AccommodationService();
    accommodations.value = await accommodationService.getAllAccommodations();
    if (guestId) {
        const guestSerice = new GuestService();
        const editGuest = await guestSerice.getGuestById(guestId);

        if (!editGuest) {
            console.log('Target guest not found');
            return;
        }

        newUserForm.value.id = guestId;
        newUserForm.value.eventId = editGuest.eventId;
        newUserForm.value.name = editGuest.name;
        newUserForm.value.groupNumber = editGuest.groupNumber;
        newUserForm.value.email = editGuest.email;
        newUserForm.value.phone = editGuest.phone;
        newUserForm.value.serialNumber = editGuest.serialNumber;
        newUserForm.value.subEvents = editGuest.subEvents.map((subEvent: { id: any; }) => subEvent.id);
        newUserForm.value.attendingSubEvents = editGuest.attendingSubEvents;
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
        if (editGuest.drinks) {
            newUserForm.value.drinks = editGuest.drinks;
        }
    }
    loading.value = false;
});

const newUserForm = ref({
    id: '',
    eventId: '',
    groupNumber: 0,
    name: '',
    email: '',
    phone: '',
    serialNumber: '',
    subEvents: [],
    attendingSubEvents: [],
    arrival: {
        type: '',
        time: '',
        number: '',
        isArrival: true,
    },
    departure: {
        type: '',
        time: '',
        number: '',
        isArrival: false,
    },
    dietaryRestrictions: '',
    accommodation: {
        id: '',
        eventId: '',
        type: '',
        name: '',
        roomNumber: '',
        location: ''
    },
    drinks: {
        willDrinkAlcohol: false,
        preferences: [],
        drinkCount: []
    }
});

const transportationTypeOptions = computed(() => {
    return Object.keys(TransportationType);
});

const arrivalTimeComputed = computed({
    get() {
        if (newUserForm.value.arrival && newUserForm.value.arrival.time) {
            return newUserForm.value.arrival.time;
        }
        return '';
    },
    set(val) {
        if (val && newUserForm.value.arrival) {
            newUserForm.value.arrival.time = val;
        }
    }
});

const arrivalNumberComputed = computed({
    get() {
        if (newUserForm.value.arrival && newUserForm.value.arrival.number) {
            return newUserForm.value.arrival.number;
        }
        return '';
    },
    set(val) {
        if (val && newUserForm.value.arrival) {
            newUserForm.value.arrival.number = val;
        }
    }
});

const departureNumberComputed = computed({
    get() {
        if (newUserForm.value.departure && newUserForm.value.departure.number) {
            return newUserForm.value.departure.number;
        }
        return '';
    },
    set(val) {
        if (val && newUserForm.value.departure) {
            newUserForm.value.departure.number = val;
        }
    }
});

const departureTimeComputed = computed({
    get() {
        if (newUserForm.value.departure && newUserForm.value.departure.time) {
            return newUserForm.value.departure.time;
        }
        return '';
    },
    set(val) {
        if (val && newUserForm.value.departure) {
            newUserForm.value.departure.time = val;
        }
    }
});

function clearArrivalTransport() {
    if (!newUserForm.value.arrival) {
        return;
    }

    newUserForm.value.arrival = {
        ...newUserForm.value.arrival,
        isArrival: true,
        number: '',
        time: ''
    }
}

function clearDepartureTransport() {
    if (!newUserForm.value.departure) {
        return;
    }

    newUserForm.value.departure = {
        ...newUserForm.value.departure,
        isArrival: false,
        time: '',
        number: '',
    }
}

async function saveGuest() {
    if (hasEditAuthority) {
        const newGuest = {
            ...newUserForm.value,
            eventId: selectedEvent.value?.id!,
            subEvents: newUserForm.value.subEvents.map(subEventId => subEvents.value.find(subEvent => subEvent.id === subEventId) as SubEvent),
        } as Guest;
        const guestService = new GuestService();
        await guestService.saveGuest(newGuest);
        setMessage('Updated user.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

const drinkPreferences = computed(() => {
    return ['SCOTCH', 'RUM', 'GIN', 'BEER', 'WHITE WINE', 'RED WINE'];
});

const chosenDrinkPreferences = computed({
    get() {
        if (newUserForm.value && newUserForm.value.drinks && newUserForm.value.drinks.preferences) {
            return newUserForm.value.drinks.preferences[0];
        }
    },
    set(val) {
        if (!newUserForm.value.drinks.preferences) {
            newUserForm.value.drinks.preferences = [];
        }
        if (val) {
            newUserForm.value.drinks.preferences[0] = val;
        }
    }
});

const willDrinkAlcoholComputed = computed({
    get() {
        return String(newUserForm.value.drinks.willDrinkAlcohol).toUpperCase();
    },
    set(val) {
        newUserForm.value.drinks.willDrinkAlcohol = !!val.toLowerCase();
    }
});

function close() {
    goToRouteSecured('guests');
}


</script>