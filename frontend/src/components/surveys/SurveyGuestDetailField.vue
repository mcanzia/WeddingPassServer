<template>
    <SurveyInfoField v-model="displayValue"></SurveyInfoField>
</template>

<script setup lang="ts">
import SurveyInfoField from '@/components/surveys/SurveyInfoField.vue';
import { Guest } from '@/models/Guest';
import { onMounted, ref } from 'vue';
import { camelCase } from 'lodash';

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: () => ''
    },
    guest: {
        type: Guest,
        required: false
    }
});

const displayValue = ref<string>();

onMounted(() => {
    if (props.guest) {
        const fieldLookup : string = `${camelCase(props.modelValue)}`;
        displayValue.value = (props.guest as Record<string, any>)[fieldLookup];

    } else {
        displayValue.value = props.modelValue;
    }
});

</script>