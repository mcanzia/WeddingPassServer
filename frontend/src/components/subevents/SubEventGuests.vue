<template>
  <div class="flex-1 mt-5 h-screen">
    <Card class="mx-auto max-w-sm h-3/4 flex flex-col">
      <CardHeader class="flex-none">
        <CardTitle class="text-2xl">
          Check In For {{ subEventNameComputed }}
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
        <div v-if="noGuests">No Guests</div>
        <div v-else v-for="guest in filteredGuests" :key="guest.id">
          <GuestCard :guest="guest" :attending-sub-event="isGuestAttendingSubEvent(guest)">
            <ConfirmAction alert-title="Do you want to remove Checked In status for this guest?"
              @on-confirm="removeAttending(guest)" v-if="isGuestAttendingSubEvent(guest)">
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
import { SubEvent } from '@/models/SubEvent';
import { Separator } from '@/components/ui/separator'
import { GuestService } from '@/services/GuestService';
import { ref, watch, computed } from 'vue';
import GuestCard from '@/components/subevents/GuestCard.vue';
import Search from '@/components/Search.vue';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import debounce from 'lodash/debounce';
import { Badge } from '@/components/ui/badge'
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';

const props = defineProps<{
  subEvent: SubEvent | null;
  subEventGuests: Guest[] | null;
}>();

// const allInvitedGuests = ref<Guest[]>([]);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const filterToggle = ref(undefined);

const subEventNameComputed = computed(() => {
  return props.subEvent ? props.subEvent.name : 'Sub Event';
});

const updateSearchQuery = debounce((value: string) => {
  debouncedSearchQuery.value = value;
}, 250);

const filteredGuests = computed(() => {
  let localGuests = props.subEventGuests ?? [];

  if (filterToggle.value && filterToggle.value === 'attending') {
    localGuests = localGuests.filter(guest => guest.attendingSubEvents?.some(subEvent => subEvent.id === props.subEvent!.id));
  } else if (filterToggle.value && filterToggle.value === 'invited') {
    localGuests = localGuests.filter(guest => !guest.attendingSubEvents?.some(subEvent => subEvent.id === props.subEvent!.id));
  }

  if (debouncedSearchQuery.value) {
    localGuests = localGuests.filter(guest =>
      guest.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
    );
  }
  return localGuests;
});

const noGuests = computed(() => {
  return !filteredGuests.value || filteredGuests.value.length === 0
});

watch(searchQuery, (newValue) => {
  updateSearchQuery(newValue);
});

function isGuestAttendingSubEvent(guest: Guest) {
  return guest.attendingSubEvents && guest.attendingSubEvents.some((subEvent: SubEvent) => subEvent.id === props.subEvent?.id);
}

async function addAttending(guest: Guest) {
  const guestService = new GuestService();
  if (!guest.attendingSubEvents) {
    guest.attendingSubEvents = [];
  }
  guest.attendingSubEvents.push(props.subEvent!);
  await guestService.saveGuest(guest);
}

async function removeAttending(guest: Guest) {
  const guestService = new GuestService();
  guest.attendingSubEvents = guest.attendingSubEvents?.filter(subEvent => subEvent.id != props.subEvent?.id);
  await guestService.saveGuest(guest);
}

function attendingText(guest: Guest) {
  return isGuestAttendingSubEvent(guest) ? 'Checked In' : 'Not Checked In';
}


</script>