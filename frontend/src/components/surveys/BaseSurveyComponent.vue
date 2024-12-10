<template>
  <div>
    <SurveyComponentWrapper v-if="builderMode" @remove="removeComponent" @openAddChild="openAddChild"
      v-model:component-label="componentDetails.label" :componentId="componentDetails.id"
      :hasAddChild="hasAddChildComputed" :infoLookupField="componentDetails.infoLookupField"
      :trigger-field="triggerField">
      <div class="w-full">
        <Component :is="displayComponentComputed" v-model="modelValueComputed" v-bind="componentProps" />
      </div>
    </SurveyComponentWrapper>

    <div class="flex flex-col gap-2 w-full px-4" v-else>
      <Label class="font-bold text-md">{{ componentDetails.label }}</Label>
      <Component :is="displayComponentComputed" v-model="modelValueComputed" v-bind="componentProps"
        :disabled="disabled" />
    </div>

    <div v-if="componentDetails.surveyTriggers && componentDetails.surveyTriggers.length">
      <div v-for="trigger in componentDetails.surveyTriggers" :key="trigger.child.id" class="mt-3">
        <BaseSurveyComponent
          v-if="builderMode || (!builderMode && componentDetails.componentValue === trigger.triggerField)"
          :disabled="disabled" :key="trigger.child.id" :guest="guest" :componentDetails="trigger.child"
          :builderMode="builderMode" :triggerField="trigger.triggerField" :parentId="props.componentDetails.id"
          @remove="removeComponent" @openAddChild="openAddChild" @update:modelValue="emitModelValue" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from "@/components/ui/label";
import SurveyComponentWrapper from "@/components/surveys/SurveyComponentWrapper.vue";
import { SurveyComponent } from "@/models/SurveyComponent";
import { computed, onMounted, PropType } from "vue";
import BaseSurveyComponent from "@/components/surveys/BaseSurveyComponent.vue";
import { useSurveyStore } from "@/components/surveys/SurveyStore";
import { Guest } from "@/models/Guest";
import { useSurveyFieldLookup } from "@/components/surveys/useSurveyFieldLookup";

const emit = defineEmits(["remove", "openAddChild", "update:modelValue"]);

const props = defineProps({
  builderMode: {
    type: Boolean,
    required: false,
    default: () => false,
  },
  componentDetails: {
    type: Object as PropType<SurveyComponent>,
    required: true,
  },
  triggerField: {
    type: String,
    required: false,
    default: () => null,
  },
  parentId: {
    type: String,
    required: false,
    default: () => null,
  },
  guest: {
    type: Object as PropType<Guest>,
    required: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: () => false
  }
});

const surveyStore = useSurveyStore();
const { hasOptionsProp, hasAddChildButton, isDisabled, findSurveyDisplayComponent } =
  surveyStore;
const { lookupGuestField } = useSurveyFieldLookup();

onMounted(() => {
  if (
    props.guest &&
    !props.componentDetails.componentValue &&
    props.componentDetails.infoLookupField
  ) {
    const fieldValue = lookupGuestField(props.guest, props.componentDetails.infoLookupField);
    modelValueComputed.value = fieldValue;
  }
});

const modelValueComputed = computed({
  get() {
    return props.componentDetails.componentValue;
  },
  set(val) {
    emit("update:modelValue", props.componentDetails.id, val);
  },
});

const componentProps = computed(() => {
  const propsToPass: Record<string, any> = {};

  if (hasOptionsProp(props.componentDetails.type)) {
    propsToPass["selectOptions"] = props.componentDetails.options;
  }

  if (props.componentDetails.infoLookupField) {
    propsToPass["infoLookupField"] = props.componentDetails.infoLookupField;
  }

  if (props.componentDetails.editableInfo) {
    propsToPass["editableInfo"] = true;
  }
  if (isDisabled(props.componentDetails.type)) {
    propsToPass["disabled"] = true;
  }

  return propsToPass;
});

const hasAddChildComputed = computed(() => {
  return hasAddChildButton(props.componentDetails.type);
});

const displayComponentComputed = computed(() => {
  return findSurveyDisplayComponent(props.componentDetails.type);
});

function removeComponent(componentId: string, parentId?: string) {
  if (parentId) {
    emit("remove", componentId, parentId);
  } else if (props.parentId) {
    emit("remove", componentId, props.parentId);
  } else {
    emit("remove", componentId, null);
  }
}

function openAddChild(componentId: string) {
  emit("openAddChild", componentId);
}

function emitModelValue(componentId: string, value: any) {
  emit("update:modelValue", componentId, value);
}
</script>