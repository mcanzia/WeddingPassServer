<template>
    <div class="grid gap-2">
        <SurveyComponentWrapper v-if="builderMode">
            <Textarea disabled />
        </SurveyComponentWrapper>
        <div v-else>
            <Label for="text-area">Hey</Label>
            <Textarea id="text-area" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Textarea } from '@/components/ui/textarea'
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