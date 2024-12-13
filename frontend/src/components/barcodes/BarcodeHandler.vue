<template>
    <div class="grid grid-cols-1 md:grid-cols-6 mt-5 mx-5 gap-5 max-h-screen">
        <Card class="w-full md:col-span-2 max-h-screen">
            <CardContent>
                <svg id="barcode"></svg>
                <Separator />
                <BarcodeScanner></BarcodeScanner>
            </CardContent>
        </Card>
        <Card class="w-full md:col-span-2 max-h-screen">
            <CardHeader class="flex-none">
                <CardTitle class="text-2xl">
                    Click guest to see barcode
                </CardTitle>
                <Search class="mb-4" placeholder="Search guest name..." v-model="searchQuery" />
                <Separator />
            </CardHeader>
            <CardContent class="flex-1 overflow-y-auto">
                <ScrollArea class="h-96">
                    <div v-if="allGuests.length === 0">No Pending Guests</div>
                    <div v-else v-for="guest in filteredGuests" :key="guest.id">
                        <GuestCard :guest="guest" @click="showBarcode(guest)"></GuestCard>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import Search from '@/components/Search.vue';
import GuestCard from '@/components/events/GuestCard.vue';
import { Separator } from '@/components/ui/separator';
import { ref, onMounted, watch, computed } from 'vue';
import { Guest } from '@/models/Guest';
import { GuestService } from '@/services/GuestService';
import { debounce } from 'lodash';
import { ScrollArea } from "@/components/ui/scroll-area";
import JsBarcode from 'jsbarcode';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import BarcodeScanner from '@/components/barcodes/BarcodeScanner.vue';

onMounted(async () => {
    const guestService = new GuestService();
    allGuests.value = await guestService.getAllGuests();
});

const allGuests = ref<Guest[]>([]);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');

const updateSearchQuery = debounce((value: string) => {
    debouncedSearchQuery.value = value;
}, 250);

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

function showBarcode(guest: Guest) {
    if (guest.serialNumber) {
        JsBarcode("#barcode", guest.serialNumber);
    } else {
        ErrorHandler.handleCustomError("Guest does not have a serial number associated with them");
    }
}

</script>