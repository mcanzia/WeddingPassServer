<template>
    <Card class="mx-auto max-h-120" v-if="survey">
        <CardHeader>
            <div class="inline-flex justify-between">
                <div>
                    <CardTitle class="text-2xl">
                        Survey Builder
                    </CardTitle>
                    <CardDescription>
                        Build your survey below
                    </CardDescription>
                </div>
                <div>
                    <Toggle class="border-solid" @click="togglePreviewMode">Preview</Toggle>
                </div>
            </div>
        </CardHeader>
        <CardContent>
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="survey-name">Survey Name</Label>
                    <Input id="survey-name" v-model="surveyTitleComputed" type="text" required />
                </div>
                <div class="grid gap-2">
                    <Label for="survey-component-selection">Survey Component</Label>
                    <div id="survey-component-selection" class="inline-flex gap-3">
                        <Select v-model="selectedComponentType" @update:model-value="clearInputs">
                            <SelectTrigger>
                                <SelectValue placeholder="Select a component type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Component Types</SelectLabel>
                                    <SelectItem v-for="option in componentOptions" :key="option.type"
                                        :value="option.type">
                                        {{ option.friendlyName }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Button @click="insertComponent">Add</Button>
                    </div>
                    <div v-if="showOptionsInput">
                        <Label for="options-text-area">Options Input</Label>
                        <Textarea v-model="componentDropdownOptions!" id="options-text-area" />
                    </div>
                    <div v-if="showPredefinedValueInput">
                        <Label for="predefined-input-value">Set Custom Value for Field</Label>
                        <Input v-model="predefinedValue!" id="predefined-input-value" />
                    </div>
                    <div v-if="showGuestDetailsDropdown">
                        <Label for="guest-details-dropdown">Choose Guest Field</Label>
                        <SingleSelectDropdown v-model="predefinedValue!" :select-options="formattedGuestDetailKeys" id="guest-details-dropdown" />
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <div class="inline-flex gap-4 justify-end">
                        <Button @click="saveSurvey">Save</Button>
                        <Button @click="close" variant="outline">Close</Button>
                    </div>
                    <div class="inline-flex justify-end">
                        <span :class="savedStatusClassesComputed">{{ savedStatus ? 'Saved' : 'Not Saved' }}</span>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { SurveyComponent } from '@/models/SurveyComponent';
import { SurveyComponentTypes } from '@/models/SurveyComponentTypes';
import { useSurveyStore } from '@/stores/SurveyStore';
import { Textarea } from '@/components/ui/textarea';
import { Toggle } from '@/components/ui/toggle';
import SingleSelectDropdown from '@/components/common/SingleSelectDropdown.vue';

const { goToRouteSecured } = useRouterHelper();
const { survey, previewMode, componentDropdownOptions, predefinedValue, savedStatus, formattedGuestDetailKeys } = storeToRefs(useSurveyStore());
const { insertSurveyDisplayComponent, hasOptionsProp, hasPredefinedValue, saveSurvey } = useSurveyStore();

const selectedComponentType = ref<string>();

const componentOptions = computed(() => {
    const surveyComponentTypes = Object.entries(SurveyComponentTypes);
    const options: SurveyComponent[] = [];

    for (let i = 0; i < surveyComponentTypes.length; i++) {
        const [key, value] = surveyComponentTypes[i];
        const surveyComponent = new SurveyComponent(key, value);
        options.push(surveyComponent);
    }

    return options;
});

const showOptionsInput = computed(() => {
    return selectedComponentType.value && hasOptionsProp(selectedComponentType.value);
});

const showPredefinedValueInput = computed(() => {
    return selectedComponentType.value && hasPredefinedValue(selectedComponentType.value);
});

const showGuestDetailsDropdown = computed(() => {
    return selectedComponentType.value && selectedComponentType.value === 'GUEST_DETAIL_FIELD';
});

const surveyTitleComputed = computed({
    get() {
        return survey.value!.title;
    },
    set(val) {
        if (survey.value) {
            survey.value.title = val;
            savedStatus.value = false;
        }
    }
});

const savedStatusClassesComputed = computed(() => {
    return `italic text-md ${!savedStatus.value ? 'text-red-700 font-bold' : ''}`;
});

function insertComponent() {
    const selectedComponent: SurveyComponent | undefined = componentOptions.value.find(option => selectedComponentType.value === option.type);
    if (selectedComponent) {
        insertSurveyDisplayComponent(selectedComponent);
    }
    savedStatus.value = false;
}

function togglePreviewMode() {
    previewMode.value = !previewMode.value;
}

function clearInputs() {
    componentDropdownOptions.value = null;
    predefinedValue.value = null;
}

function close() {
    clearInputs();
    goToRouteSecured('surveys');
}

</script>