<template>
    <div class="grid grid-cols-1 md:grid-cols-6 mt-5 mx-5 gap-5 max-h-screen">
        <Card class="w-full md:col-span-2 max-h-screen">
            <CardContent>
                <svg id="barcode"></svg>
                <Separator />
                <div class="mb-4 flex space-x-2" v-if="selectedGuest">
                    <Button @click="downloadSVG" class="bg-blue-500 text-white px-4 py-2 rounded-md">
                        Download SVG
                    </Button>
                    <Button @click="downloadPNG" class="bg-green-500 text-white px-4 py-2 rounded-md">
                        Download PNG
                    </Button>
                </div>
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
import Button from '@/components/ui/button/Button.vue';
import { saveAs } from 'file-saver';

onMounted(async () => {
    const guestService = new GuestService();
    allGuests.value = await guestService.getAllGuests();
});

const allGuests = ref<Guest[]>([]);
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const selectedGuest = ref<Guest>();

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
        JsBarcode("#barcode", guest.serialNumber, {
            displayValue: false,
            height: 40,
        });
        selectedGuest.value = guest;
    } else {
        ErrorHandler.handleCustomError("Guest does not have a serial number associated with them");
    }
}

function downloadSVG() {
    const svg = document.getElementById('barcode') as unknown as SVGElement;
    if (!svg) {
        ErrorHandler.handleCustomError("Barcode SVG not found");
        return;
    }

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `barcode-${selectedGuest.value?.serialNumber}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function downloadPNG() {
    const svg = document.getElementById('barcode') as unknown as SVGElement;
    if (!svg) {
        ErrorHandler.handleCustomError("Barcode SVG not found");
        return;
    }

    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);

    if (!source.match(/^<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+"http:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        if (!context) {
            ErrorHandler.handleCustomError("Canvas context not available");
            return;
        }
        context.drawImage(img, 0, 0);

        const pngDataUrl = canvas.toDataURL('image/png');

        saveAs(pngDataUrl, `barcode-${selectedGuest.value?.serialNumber}.png`);
    };
    img.src = url;
}

</script>