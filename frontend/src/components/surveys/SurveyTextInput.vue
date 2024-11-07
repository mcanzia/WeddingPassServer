<template>
    <div class="grid gap-2">
        <SurveyComponentWrapper v-if="builderMode">
            <Input id="text-input" type="text" disabled />
        </SurveyComponentWrapper>
        <div v-else>
            <Label for="text-input">Hey</Label>
            <Input id="text-input" type="text" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SurveyComponentWrapper from '@/components/surveys/SurveyComponentWrapper.vue';

defineProps({
    builderMode: {
        type: Boolean,
        required: false,
        default: () => false
    },
    componentDetails: {
        type: Object,
        required: false,
        default: () => {}
    }
    
});

</script>