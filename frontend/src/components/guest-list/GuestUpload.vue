<template>
    <div>
        <Button @click="downloadUsers" class="ml-5">Download Users</Button>
        <div v-if="!isTrio" ref="dropZoneRef"
            class="flex flex-col max-w-md h-40 bg-gray-400/10 justify-center items-center my-6 rounded mx-5">
            <div font-bold mb2>
                Drop Excel or CSV file here
            </div>
            <Separator class="my-4" label="Or" />
            <Button variant="outline" @click="open">
                Choose file
            </Button>
        </div>
        <Card class="mx-auto max-w-sm" v-if="showValidationArea && !isTrio">
            <CardHeader>
                <CardTitle class="text-2xl">
                    Upload Validation
                </CardTitle>
                <CardDescription>
                    {{ validationAreaDescription }}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Table class="table-fixed" style="width: 100%; max-width: 500px;"
                    v-if="guestValidation && guestValidation.uploadIssues.size > 0">
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-1/2">Guest Name</TableHead>
                            <TableHead class="w-1/2">Issue</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="[key, value] in guestValidation.uploadIssues.entries()" :key="key">
                            <TableCell class="font-medium truncate w-1/2">{{ key }}</TableCell>
                            <TableCell class="w-1/2 text-wrap">{{ value }}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                <div class="pt-5 flex justify-end">
                    <Button variant="outline" @click="cancelUpload">
                        Cancel
                    </Button>
                    <Button @click="proceedWithUpload" class="mx-3">
                        Continue
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
</template>


<script setup lang="ts">
import { useDropZone, useFileDialog } from '@vueuse/core';
import { ref, computed } from 'vue';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { GuestService } from '@/services/GuestService';
import { UploadValidation } from '@/models/UploadValidation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { useUserStore } from '@/stores/UserStore';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { storeToRefs } from 'pinia';

const guestService = new GuestService();

const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority, isTrio } = storeToRefs(userStore);

const dropZoneRef = ref<HTMLDivElement>()
const guestValidation = ref<UploadValidation | null>();
const showValidationArea = ref(false);

function onDrop(files: File[] | null) {
    if (files && files[0] && !showValidationArea.value) {
        handleFileUpload(files[0]);
    }
}

const { isOverDropZone } = useDropZone(dropZoneRef, {
    onDrop,
    dataTypes: ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
    multiple: true,
    preventDefaultForUnhandled: false,
});

const { files, open, reset, onCancel, onChange } = useFileDialog({
    accept: '.csv, .xlsx, .xls',
});

onChange((files) => {
    if (files && files[0]) {
        handleFileUpload(files[0]);
    }
});

const uploadCreateList = computed(() => {
    return guestValidation.value && guestValidation.value.uploadGuestLists
        && guestValidation.value.uploadGuestLists.createGuests ? guestValidation.value.uploadGuestLists.createGuests : [];
})

const uploadUpdateList = computed(() => {
    return guestValidation.value && guestValidation.value.uploadGuestLists
        && guestValidation.value.uploadGuestLists.updateGuests ? guestValidation.value.uploadGuestLists.updateGuests : [];
})

const uploadIssues = computed(() => {
    return guestValidation.value && guestValidation.value.uploadIssues ? guestValidation.value.uploadIssues : new Map()
})

const validationAreaDescription = computed(() => {
    const uploadCreateListSize = uploadCreateList.value.length ?? 0;
    const uploadUpdateListSize = uploadUpdateList.value.length ?? 0;
    if (uploadIssues.value.size === 0) {
        return `Validation was successful for all rows. Please click continue to proceed with upload. 
        Creating ${uploadCreateListSize} and Updating ${uploadUpdateListSize}.`;
    } else {
        return `There were ${uploadCreateListSize! + uploadUpdateListSize!} successfully validated guests.
        Creating ${uploadCreateListSize} and Updating ${uploadUpdateListSize}.
        Please see errors below. You can click continue to upload validated guests or click cancel to fix errors and reupload.`;
    }
});

async function handleFileUpload(file: File) {
    if (hasEditAuthority) {
        guestValidation.value = await guestService.guestFileUpload(file);
        showValidationArea.value = true;
    } else {
        ErrorHandler.handleAuthorizationError();
    }
}

function cancelUpload() {
    showValidationArea.value = false;
    guestValidation.value = null;
}

async function proceedWithUpload() {
    if (guestValidation.value && guestValidation.value?.uploadGuestLists) {
        if (uploadCreateList.value.length) {
            await guestService.batchAddGuests(uploadCreateList.value);

        }

        if (uploadUpdateList.value.length) {
            await guestService.batchUpdateGuests(uploadUpdateList.value);
        }
        showValidationArea.value = false;
        guestValidation.value = null;
        setMessage('Uploaded users successfully.', NotificationType.SUCCESS);

    }
}

function downloadUsers() {
    guestService.guestFileDownload();
}

</script>