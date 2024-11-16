<template>
  <Card
    class="mx-auto max-h-120"
    v-if="survey"
  >
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
          <Toggle
            class="border-solid"
            @click="togglePreviewMode"
          >Preview</Toggle>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="survey-name">Survey Name</Label>
          <Input
            id="survey-name"
            v-model="surveyTitleComputed"
            type="text"
            required
          />
        </div>
        <div v-if="parentFieldId">
          <div class="grid gap-2">
            <Badge
              class="font-bold bg-yellow-200 justify-self-center"
              disabled
            >
              <span>Add Child Mode</span>
              <ion-icon
                name="close"
                @click="closeAddChildMode"
                class="ml-2 size-5 cursor-pointer"
              />
            </Badge>
          </div>
          <div class="grid gap-2">
            <Label for="parent-trigger-field">Parent Trigger Field</Label>
            <SingleSelectDropdown
              v-model="parentTriggerFieldComputed"
              :select-options="parentSelectOptions"
              id="guest-details-dropdown"
            />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="survey-component-selection">Survey Component</Label>
          <div
            id="survey-component-selection"
            class="inline-flex gap-3"
          >
            <Select
              v-model="selectedComponentType"
              @update:model-value="clearInputs"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a component type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Component Types</SelectLabel>
                  <SelectItem
                    v-for="option in componentOptions"
                    :key="option.type"
                    :value="option.type"
                  >
                    {{ option.friendlyName }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button @click="insertComponent">Add</Button>
          </div>
          <div v-if="showOptionsInput">
            <Label for="options-text-area">Options Input</Label>
            <Textarea
              v-model="componentDropdownOptionsComputed"
              id="options-text-area"
            />
          </div>
          <div v-if="showPredefinedValueInput">
            <Label for="predefined-input-value">Set Custom Value for Field</Label>
            <Input
              v-model="predefinedValueComputed"
              id="predefined-input-value"
            />
          </div>
          <div>
            <Label for="guest-details-dropdown">Guest Field Lookup</Label>
            <SingleSelectDropdown
              v-model="infoLookupFieldComputed"
              :select-options="formattedGuestDetailKeys"
              clearable
              id="guest-details-dropdown"
            />
          </div>
          <div
            v-if="showEditableInfoToggle"
            class="flex items-center space-x-2 mt-2"
          >
            <Label for="editable-info-toggle">Editable?</Label>
            <Switch
              :checked="editableInfo"
              @update:checked="toggleEditableInfo"
              id="editable-info-toggle"
            />
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <div class="inline-flex gap-4 justify-end">
            <Button @click="saveSurvey">Save</Button>
            <Button
              @click="close"
              variant="outline"
            >Close</Button>
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouterHelper } from "@/util/composables/useRouterHelper";
import { SurveyComponent } from "@/models/SurveyComponent";
import { SurveyComponentTypes } from "@/models/SurveyComponentTypes";
import { useSurveyStore } from "@/components/surveys/SurveyStore";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Switch } from "@/components/ui/switch";
import SingleSelectDropdown from "@/components/common/SingleSelectDropdown.vue";

const { goToRouteSecured } = useRouterHelper();
const {
  survey,
  previewMode,
  parentFieldId,
  componentDropdownOptions,
  predefinedValue,
  infoLookupField,
  editableInfo,
  savedStatus,
  formattedGuestDetailKeys,
  parentTriggerField,
  parentSelectOptions,
} = storeToRefs(useSurveyStore());
const {
  insertSurveyDisplayComponent,
  hasOptionsProp,
  hasPredefinedValue,
  hasDetailDropdown,
  hasEditableInfoToggle,
  saveSurvey,
  togglePreviewMode,
} = useSurveyStore();

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

const componentDropdownOptionsComputed = computed({
  get() {
    if (componentDropdownOptions.value) {
      return componentDropdownOptions.value;
    }
  },
  set(newValue: string) {
    componentDropdownOptions.value = newValue;
  },
});

const predefinedValueComputed = computed({
  get() {
    if (predefinedValue.value) {
      return predefinedValue.value;
    }
  },
  set(newValue: string) {
    predefinedValue.value = newValue;
  },
});

const infoLookupFieldComputed = computed({
  get() {
    if (infoLookupField.value) {
      return infoLookupField.value;
    }
  },
  set(newValue: string | null) {
    infoLookupField.value = newValue;
  },
});

const parentTriggerFieldComputed = computed({
  get() {
    if (parentTriggerField.value) {
      return parentTriggerField.value;
    }
  },
  set(val) {
    parentTriggerField.value = val;
  },
});

const showOptionsInput = computed(() => {
  return (
    selectedComponentType.value && hasOptionsProp(selectedComponentType.value)
  );
});

const showPredefinedValueInput = computed(() => {
  return (
    selectedComponentType.value &&
    hasPredefinedValue(selectedComponentType.value)
  );
});

const showGuestDetailsDropdown = computed(() => {
  return (
    selectedComponentType.value &&
    hasDetailDropdown(selectedComponentType.value)
  );
});

const showEditableInfoToggle = computed(() => {
  return (
    selectedComponentType.value &&
    hasEditableInfoToggle(selectedComponentType.value)
  );
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
  },
});

const savedStatusClassesComputed = computed(() => {
  return `italic text-md ${!savedStatus.value ? "text-red-700 font-bold" : ""}`;
});

function insertComponent() {
  const selectedComponent: SurveyComponent | undefined =
    componentOptions.value.find(
      (option) => selectedComponentType.value === option.type
    );
  if (selectedComponent) {
    insertSurveyDisplayComponent(selectedComponent);
    savedStatus.value = false;
  }
}

function clearInputs() {
  componentDropdownOptions.value = null;
  predefinedValue.value = null;
  editableInfo.value = false;
}

function close() {
  clearInputs();
  goToRouteSecured("surveys");
}

function toggleEditableInfo(value: boolean) {
  editableInfo.value = value;
}

function closeAddChildMode() {
  parentFieldId.value = null;
  parentTriggerField.value = null;
}
</script>