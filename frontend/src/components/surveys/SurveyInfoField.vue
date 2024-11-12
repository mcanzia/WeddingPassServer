<template>
    <Label v-if="!editableInfo">{{ modelValue }}</Label>
    <input v-else v-model="modelValueComputed" class="bg-inherit border-0 outline-transparent" />
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import { computed } from "vue";

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: () => ''
    },
    editableInfo: {
        type: Boolean,
        required: false,
        default: () => false
    }
});

const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    }
})

</script>