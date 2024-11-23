<template>
  <div class="flex gap-2">
    <Select v-model="modelValueComputed">
      <SelectTrigger>
        <SelectValue :placeholder="placeholder" />
      </SelectTrigger>
      <SelectContent class="max-h-60 overflow-y-scroll">
        <SelectGroup>
          <SelectItem
            v-for="option in selectOptions"
            :key="option"
            :value="option"
          >
            {{ option }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <IconButton
      v-if="clearable"
      icon="close"
      @click="clearValue"
    ></IconButton>
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
    type: Array<string>,
    required: false,
    default: () => [],
  },
  modelValue: {
    type: String,
    required: false,
    default: () => null,
  },
  placeholder: {
    type: String,
    required: false,
    default: () => "",
  },
  clearable: {
    type: Boolean,
    required: false,
    default: () => false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const modelValueComputed = computed({
  get() {
    return props.modelValue;
  },
  set(val: string | null) {
    emit("update:modelValue", val);
  },
});

function clearValue() {
  modelValueComputed.value = null;
}
</script>