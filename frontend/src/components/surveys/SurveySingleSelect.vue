<template>
    <div class="grid gap-2">
        <SurveyComponentWrapper v-if="builderMode">
            <Select>
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem v-for="option in componentDetails.options" :key="option" :value="option">
                            {{ option }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </SurveyComponentWrapper>
        <div v-else>
            <Label for="single-select">Hey</Label>
            <Select id="single-select">
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem v-for="option in componentDetails.options" :key="option" :value="option">
                            {{ option }}
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
        default: () => { }
    }

});

</script>