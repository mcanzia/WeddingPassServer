<template>
    <div class="h-full">
        <div class="flex justify-center items-center">
            <template v-if="loaded">
                <Button class="bg-yellow-300 px-6 py-1 rounded-md me-4" @click="handleFacemode">
                    Switch Camera
                </Button>
                <Button class="bg-red-300 px-6 py-1 rounded-md" @click="handleOnCanStop">Close Scanner</Button>
            </template>

            <template v-else>
                <Button class="bg-green-300 px-6 py-1 rounded-md me-4" @click="handleOnCanPlay">Open Scanner</Button>

                <Button v-if="decode" class="bg-blue-300 px-6 py-1 rounded-md" @click="handleOnReset">
                    Reset
                </Button>
            </template>
        </div>

        <div class="flex flex-col items-center justify-center h-full">
            <div class="phone mt-6">
                <div class="notch-container">
                    <div class="notch"></div>
                </div>

                <div>
                    <StreamQrcodeBarcodeReader ref="refCamera" capture="shoot" show-on-stream @onloading="onLoading"
                        @result="onResult" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { type Result, StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader';
import Button from '@/components/ui/button/Button.vue';

const emits = defineEmits(['decode', 'isReady']);

const props = defineProps({
    instantLoad: {
        type: Boolean,
        required: false,
        default: () => false
    },
    hideCameraButtons: {
        type: Boolean,
        required: false,
        default: () => false
    }
});

onMounted(async () => {
    if (props.instantLoad) {
        await handleOnCanPlay();
        emits('isReady');
    }
});

const decode = ref<Result | undefined>(undefined);
const loaded = ref<boolean>(false);

function onResult(data: Result | undefined): void {
    decode.value = data
    if (decode.value) {
        emits('decode', decode.value.getText());
        handleOnCanStop();
    }
}

function onLoading(loading: boolean) {
    loaded.value = loading
}

const refCamera = ref<InstanceType<typeof StreamQrcodeBarcodeReader> | null>(null)

function handleOnCanPlay() {
    refCamera.value?.onCanPlay()
}

function handleOnReset() {
    refCamera.value?.onReset()
}

function handleFacemode() {
    refCamera.value?.onChangeFacemode()
}

function handleOnCanStop() {
    refCamera.value?.onCanStop()
}
</script>

<style scoped>
:deep(.scanner__container .content) {
    min-height: 0 !important;
    height: 100% !important;
    border: none !important;
    background: transparent !important;
}

:deep(.scanner__container .content video) {
    width: 100% !important;
    height: 100% !important;
}

:deep(.scanner__container .container-btn-stop) {
    margin-top: 40px !important;
    visibility: hidden !important;
}

:deep(.scanner__container .container-btn-facemode) {
    margin-top: 40px !important;
    visibility: hidden !important;
}
</style>
