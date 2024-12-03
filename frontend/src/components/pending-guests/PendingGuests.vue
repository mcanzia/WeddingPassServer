<template>
    <div class="grid grid-cols-1 md:grid-cols-6 mt-5 mx-5 gap-5 max-h-screen">
        <Card class="w-full md:col-span-2 max-h-screen">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Pending Guests
                </CardTitle>
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <div v-if="filteredPendingGuests.length === 0">No Pending Guests</div>
                <div v-else v-for="pendingGuest in filteredPendingGuests" :key="pendingGuest.id">
                    <PendingGuestCard :pending-guest="pendingGuest" @link-guest="selectGuestToLink(pendingGuest)" />
                </div>
            </CardContent>
        </Card>
        <Card class="w-full md:col-span-2 max-h-screen" v-if="linkingGuest">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Link to existing guest
                </CardTitle>
                <Search class="mb-4" placeholder="Search guest name..." v-model="searchQuery" />
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <ScrollArea class="h-96">
                    <div v-if="allGuests.length === 0">No Pending Guests</div>
                    <div v-else v-for="guest in filteredGuests" :key="guest.id">
                        <GuestCard :guest="guest">
                            <ConfirmAction alert-title="Do you want to link this user account to this guest?"
                                @on-confirm="confirmAccountLink(guest)">
                                <Badge class="cursor-pointer">
                                    Link User
                                </Badge>
                            </ConfirmAction>
                        </GuestCard>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator'
import { ref, computed, onMounted, watch } from 'vue';
import PendingGuestCard from '@/components/pending-guests/PendingGuestCard.vue';
import { PendingGuest } from '@/models/PendingGuest';
import { GuestInviteStatus } from '@/models/GuestInviteStatus';
import { PendingGuestService } from '@/services/PendingGuestService';
import { Guest } from '@/models/Guest';
import { GuestService } from '@/services/GuestService';
import GuestCard from '@/components/events/GuestCard.vue';
import Search from '@/components/Search.vue';
import { debounce } from 'lodash';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from '@/components/ui/badge'
import ConfirmAction from '@/components/data-table/ConfirmAction.vue';
import { SuccessHandler } from '@/util/SuccessHandler';

onMounted(async () => {
    const pendingGuestService = new PendingGuestService();
    allPendingGuests.value = await pendingGuestService.getAllPendingGuests();
    const guestService = new GuestService();
    allGuests.value = await guestService.getAllGuests();
});

const allPendingGuests = ref<PendingGuest[]>([]);
const linkingGuest = ref<PendingGuest>();

const allGuests = ref<Guest[]>([]);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

const filteredPendingGuests = computed(() => {
    return allPendingGuests.value.filter(guest => guest.status === GuestInviteStatus.PENDING);
});

function selectGuestToLink(pendingGuest: PendingGuest) {
    linkingGuest.value = pendingGuest;
}

watch(searchQuery, (newValue) => {
    updateSearchQuery(newValue);
});

const filteredGuests = computed(() => {
    let localGuests = allGuests.value;

    if (debouncedSearchQuery.value) {
        localGuests = localGuests.filter(guest =>
            guest.name.toLowerCase().includes(debouncedSearchQuery.value.toLowerCase())
        );
    }
    return localGuests;
});

async function confirmAccountLink(guest: Guest) {
    if (linkingGuest.value && guest) {
        const pendingGuestService = new PendingGuestService();
        guest = await pendingGuestService.linkGuestAccount(linkingGuest.value, guest);
        SuccessHandler.showNotification('Successfully linked guest account');
    }
}






</script>