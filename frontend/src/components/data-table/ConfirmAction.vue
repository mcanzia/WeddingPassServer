<template>
    <AlertDialog>
        <AlertDialogTrigger :disabled="disabled">
            <slot />
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ alertTitle }}</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ alertDescription }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <slot name="content" />
            <AlertDialogFooter>
                <AlertDialogCancel @click="onCancel">{{ alertCancelText }}</AlertDialogCancel>
                <AlertDialogAction @click="onConfirm">{{ alertConfirmText }}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

defineProps({
    alertDescription: {
        type: String,
        required: false,
        default: () => ''
    },
    alertTitle: {
        type: String,
        required: false,
        default: () => 'Confirm Action?'
    },
    alertCancelText: {
        type: String,
        required: false,
        default: () => 'Cancel'
    },
    alertConfirmText: {
        type: String,
        required: false,
        default: () => 'Confirm'
    },
    disabled: {
        type: Boolean,
        required: false,
        default: () => false
    }
});

const emit = defineEmits(['onCancel', 'onConfirm']);

function onCancel() {
    emit('onCancel');
}

function onConfirm() {
    emit('onConfirm');
}
</script>