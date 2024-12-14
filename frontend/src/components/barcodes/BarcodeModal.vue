<template>
    <BasicModal ref="modalRef">
        <template v-slot:trigger>
            <Button class="ml-3">Scan Barcode</Button>
        </template>
        <BarcodeScanner :instant-load="true" @decode="lookupGuest">
        </BarcodeScanner>
    </BasicModal>
</template>

<script setup lang="ts">
import BasicModal from '@/components/common/BasicModal.vue';
import Button from '@/components/ui/button/Button.vue';
import BarcodeScanner from '@/components/barcodes/BarcodeScanner.vue';
import { GuestService } from '@/services/GuestService';
import { Guest } from '@/models/Guest';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { onMounted, ref } from 'vue';

const emits = defineEmits(['barcodeScanned']);

const modalRef = ref<InstanceType<typeof BasicModal> | null>(null);

async function lookupGuest(serialNumber: string) {
    const guestService = new GuestService();
    const guest: Guest = await guestService.getGuestBySerialNumber(serialNumber);
    if (guest) {
        emits('barcodeScanned', guest);
        modalRef.value?.close();
    } else {
        ErrorHandler.handleCustomError('Guest not found. Please search manually.');
    }
}

</script>