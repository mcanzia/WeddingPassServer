<template>
    <Label>{{ modelValue }}</Label>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";

defineProps({
    modelValue: {
        type: String,
        required: false,
        default: () => ''
    }
});

</script>