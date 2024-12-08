<template>
  <div class="flex gap-2">
    <Select v-model="internalValue" :disabled="disabled">
      <SelectTrigger>
        <SelectValue :placeholder="placeholder" :value="displayValue" />
      </SelectTrigger>
      <SelectContent class="max-h-60 overflow-y-scroll">
        <SelectGroup>
          <SelectItem v-for="option in selectOptions" :key="getOptionKey(option)" :value="getOptionKey(option)"
            :disabled="disabled">
            {{ getOptionLabel(option) }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <IconButton v-if="clearable" icon="close" @click="clearValue" :disabled="disabled"></IconButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import IconButton from "@/components/common/IconButton.vue";

const props = defineProps({
  selectOptions: {
    type: Array as () => (string | Record<string, unknown>)[],
    required: false,
    default: () => [],
  },
  modelValue: {
    type: [String, Object],
    required: false,
    default: null,
  },
  fieldKey: {
    type: String,
    required: false,
    default: null,
  },
  placeholder: {
    type: String,
    required: false,
    default: "",
  },
  clearable: {
    type: Boolean,
    required: false,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);


const internalValue = computed<string | undefined>({
  get() {
    if (props.modelValue === null) return undefined;
    if (typeof props.modelValue === "string") {
      return props.modelValue;
    }
    if (typeof props.modelValue === "object" && props.fieldKey) {
      const fieldValue = props.modelValue[props.fieldKey];
      return typeof fieldValue === "string" ? fieldValue : undefined;
    }
    return undefined;
  },
  set(val: string | undefined) {
    if (val === undefined) {
      emit("update:modelValue", null);
      return;
    }

    const matchedOption = props.selectOptions.find(
      (option) => getOptionKey(option) === val
    );

    if (matchedOption && typeof matchedOption === "object" && props.fieldKey) {
      emit("update:modelValue", matchedOption);
    } else {
      emit("update:modelValue", val);
    }
  },
});


const displayValue = computed(() => {
  if (internalValue.value === null) return "";

  const matchedOption = props.selectOptions.find(
    (option) => getOptionKey(option) === internalValue.value
  );

  return matchedOption ? getOptionLabel(matchedOption) : internalValue.value;
});


function getOptionKey(option: string | Record<string, unknown>): string {
  if (typeof option === "object" && option !== null && props.fieldKey) {
    const fieldValue = option[props.fieldKey];
    return typeof fieldValue === "string" ? fieldValue : "";
  }
  return typeof option === "string" ? option : "";
}

function getOptionLabel(option: string | Record<string, unknown>): string {
  if (typeof option === "object" && option !== null && props.fieldKey) {
    const fieldValue = option[props.fieldKey];
    return typeof fieldValue === "string" ? fieldValue : "";
  }
  return typeof option === "string" ? option : "";
}

function clearValue() {
  internalValue.value = undefined;
}
</script>
