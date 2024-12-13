<template>
    <div class="flex justify-center items-center mt-10">
        <template v-if="isLoading">
            <Button class="bg-yellow-300 px-6 py-1 rounded-md me-4" @click="handleFacemode">
                Facemode
            </Button>
            <Button class="bg-red-300 px-6 py-1 rounded-md" @click="handleOnCanStop">Stop</Button>
        </template>

        <template v-else>
            <Button class="bg-green-300 px-6 py-1 rounded-md" @click="handleOnCanPlay">Stream</Button>

            <Button v-if="decode" class="bg-blue-300 px-6 py-1 rounded-md" @click="handleOnReset">
                Reset
            </Button>
        </template>
    </div>

    <div class="flex flex-col items-center justify-center mt-6">
        <div class="phone mt-6">
            <div class="notch-container">
                <div class="notch"></div>
            </div>

            <div>
                <StreamQrcodeBarcodeReader class="h-50" ref="refCamera" capture="shoot" show-on-stream
                    @onloading="onLoading" @result="onResult" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { type Result, StreamQrcodeBarcodeReader } from 'vue3-barcode-qrcode-reader';
import Button from '@/components/ui/button/Button.vue';

const emits = defineEmits(['decode']);

const decode = ref<Result | undefined>(undefined)
const isLoading = ref<boolean>(false)
function onResult(data: Result | undefined): void {
    decode.value = data
    if (decode.value) {
        emits('decode', decode.value.getText());
    }
}

function onLoading(loading: boolean) {
    isLoading.value = loading
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