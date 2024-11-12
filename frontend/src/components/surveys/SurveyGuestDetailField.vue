<template>
    <SurveyInfoField v-model="modelValueComputed" :editableInfo="editableInfo"></SurveyInfoField>
</template>

<script setup lang="ts">
import SurveyInfoField from '@/components/surveys/SurveyInfoField.vue';
import { Guest } from '@/models/Guest';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: () => ''
    },
    guest: {
        type: Guest,
        required: false
    },
    infoLookupField: {
        type: String,
        required: false,
        default: () => null
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
        if (props.guest && !props.modelValue) {
        return (props.guest as Record<string, any>)[props.infoLookupField];
    } else if (props.modelValue) {
        return props.modelValue;
    } else {
        return props.infoLookupField;
    }
    },
    set(val) {
        emit('update:modelValue', val);
    }
})

</script>