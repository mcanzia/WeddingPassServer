<template>
  <div class="flex-1 mt-5 h-screen">
    <Card class="mx-auto max-w-sm h-3/4 flex flex-col">
      <CardHeader class="flex-none">
        <CardTitle class="text-2xl">
          Check In For {{ eventNameComputed }}
        </CardTitle>
        <ToggleGroup v-model="filterToggle" type="single" variant="outline" class="my-4 flex justify-center gap-6">
          <ToggleGroupItem value="attending" key="attending">
            Only Checked In
          </ToggleGroupItem>
          <ToggleGroupItem value="invited" key="invited">
            Only Not Checked In
          </ToggleGroupItem>
        </ToggleGroup>
        <Search class="mb-4" placeholder="Search guest name..." v-model="searchQuery" />
        <Separator />
      </CardHeader>
      <CardContent class="flex-1 overflow-y-auto">
        <div v-if="filteredGuests.length === 0">No Guests</div>
        <div v-else v-for="guest in filteredGuests" :key="guest.id">
          <GuestCard :guest="guest" :attending-event="isGuestAttendingEvent(guest)">
            <ConfirmAction alert-title="Do you want to remove Checked In status for this guest?"
              @on-confirm="removeAttending(guest)" v-if="isGuestAttendingEvent(guest)">
              <Badge class="cursor-pointer">
                {{ attendingText(guest) }}
              </Badge>
            </ConfirmAction>
            <Badge v-else @click="addAttending(guest)" class="cursor-pointer">
              {{ attendingText(guest) }}
            </Badge>
          </GuestCard>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Guest } from '@/models/Guest';
import { WeddingEvent } from '@/models/WeddingEvent';
import { Separator } from '@/components/ui/separator'
import { GuestService } from '@/services/GuestService';
import { ref, watch, computed } from 'vue';
import GuestCard from '@/components/events/GuestCard.vue';
import Search from '@/components/Search.vue';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import debounce from 'lodash/debounce';
import { Badge } from '@/components/ui/badge'
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';

const props = defineProps<{
  weddingEvent: WeddingEvent | null;
  eventGuests: Guest[];
}>();

// const allInvitedGuests = ref<Guest[]>([]);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const filterToggle = ref(undefined);

const eventNameComputed = computed(() => {
  return props.weddingEvent ? props.weddingEvent.name : 'Event';
});

const updateSearchQuery = debounce((value: string) => {
  debouncedSearchQuery.value = value;
}, 250);

const filteredGuests = computed(() => {
  let localGuests = props.eventGuests;

  if (filterToggle.value && filterToggle.value === 'attending') {
    localGuests = localGuests.filter(guest => guest.attendingEvents?.some(event => event.id === props.weddingEvent!.id));
  } else if (filterToggle.value && filterToggle.value === 'invited') {
    localGuests = localGuests.filter(guest => !guest.attendingEvents?.some(event => event.id === props.weddingEvent!.id));
  }

  if (debouncedSearchQuery.value) {
    localGuests = localGuests.filter(guest =>
      guest.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
    );
  }
  return localGuests;
});

watch(searchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

function isGuestAttendingEvent(guest: Guest) {
  return guest.attendingEvents && guest.attendingEvents.some((event: WeddingEvent) => event.id === props.weddingEvent?.id);
}

async function addAttending(guest: Guest) {
  const guestService = new GuestService();
  guest.attendingEvents?.push(props.weddingEvent!);
  await guestService.saveGuest(guest);
}

async function removeAttending(guest: Guest) {
  const guestService = new GuestService();
  guest.attendingEvents = guest.attendingEvents?.filter(event => event.id != props.weddingEvent?.id);
  await guestService.saveGuest(guest);
}

function attendingText(guest: Guest) {
  return isGuestAttendingEvent(guest) ? 'Checked In' : 'Not Checked In';
}


</script>