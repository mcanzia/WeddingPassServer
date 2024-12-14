<template>
    <Dialog v-model:open="isOpen">
        <DialogTrigger :disabled="disabled">
            <slot name="trigger"></slot>
        </DialogTrigger>
        <DialogContent :class="`max-w-${size}`">
            <DialogHeader>
                <DialogTitle>{{ modalTitle }}</DialogTitle>
                <DialogDescription>
                    {{ modalDescription }}
                </DialogDescription>
            </DialogHeader>
            <slot></slot>
            <DialogFooter>
                <slot name="footer"></slot>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { ref } from 'vue';

defineProps({
    modalDescription: {
        type: String,
        required: false,
        default: () => ''
    },
    modalTitle: {
        type: String,
        required: false,
        default: () => ''
    },
    disabled: {
        type: Boolean,
        required: false,
        default: () => false
    },
    size: {
        type: String,
        required: false,
        default: () => 'sm'
    }
});

const isOpen = ref(false);

function close() {
    isOpen.value = false;
}

function open() {
    isOpen.value = true;
}

defineExpose({
    close,
    open,
});
</script>