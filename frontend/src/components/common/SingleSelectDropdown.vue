<template>
    <Select v-model="modelValueComputed">
        <SelectTrigger>
            <SelectValue :placeholder="placeholder"/>
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectItem v-for="option in selectOptions" :key="option" :value="option">
                    {{ option }}
                </SelectItem>
            </SelectGroup>
        </SelectContent>
    </Select>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const props = defineProps({
    selectOptions: {
        type: Array<string>,
        required: false,
        default: () => []
    },
    modelValue: {
        type: String,
        required: false,
        default: () => null
    },
    placeholder: {
        type: String,
        required: false,
        default: () => ''
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
});
</script>