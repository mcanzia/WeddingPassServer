<template>
    <Card class="mx-auto">
        <CardHeader>
            <CardTitle class="text-2xl">
                Survey Builder
            </CardTitle>
            <CardDescription>
                Build your survey below
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="survey-name">Survey Name</Label>
                    <Input id="survey-name" type="text" required />
                </div>
                <div class="grid gap-2">
                    <Label for="survey-component-selection">Survey Component</Label>
                    <div id="survey-component-selection" class="inline-flex gap-3">
                        <Select v-model="selectedComponentType">
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
                    <div>
                        <Label for="options-text-area">Options Input</Label>
                        <Textarea v-model="componentDropdownOptions" id="options-text-area" />
                    </div>
                </div>
                <div class="inline-flex gap-4 justify-end">
                    <Button @click="saveSurvey">Save</Button>
                    <Button @click="close" variant="outline">Cancel</Button>
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
import { ref, onMounted, computed } from 'vue';
import { useNotificationStore } from '@/stores/NotificationStore';
import { NotificationType } from '@/models/NotificationType';
import { ErrorHandler } from '@/util/error/ErrorHandler';
import { useUserStore } from '@/stores/UserStore';
import { storeToRefs } from 'pinia';
import { useRouterHelper } from '@/util/composables/useRouterHelper';
import { Survey } from '@/models/Survey';
import { SurveyService } from '@/services/SurveyService';
import { SurveyComponent } from '@/models/SurveyComponent';
import { SurveyComponentTypes } from '@/models/SurveyComponentTypes';
import { useSurveyStore } from '@/stores/SurveyStore';
import { Textarea } from '@/components/ui/textarea'

const { goToRouteSecured } = useRouterHelper();
const notificationStore = useNotificationStore();
const { setMessage } = notificationStore;
const userStore = useUserStore();
const { hasEditAuthority } = storeToRefs(userStore);
const {survey} = storeToRefs(useSurveyStore());
const {insertSurveyDisplayComponent} = useSurveyStore();

const selectedComponentType = ref<string>();
const componentDropdownOptions = ref<string>();

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

async function saveSurvey() {
    if (hasEditAuthority && survey.value) {
        const surveyService = new SurveyService();
        await surveyService.addSurvey(survey.value);
        setMessage('Added survey.', NotificationType.SUCCESS);
        close();
    } else {
        ErrorHandler.handleAuthorizationError();
        close();
    }
}

function close() {
    goToRouteSecured('guests');
}

function insertComponent() {
    const selectedComponent : SurveyComponent | undefined = componentOptions.value.find(option => selectedComponentType.value === option.type);
    if (selectedComponent) {
        insertSurveyDisplayComponent(selectedComponent, componentDropdownOptions.value);
    }
}

</script>