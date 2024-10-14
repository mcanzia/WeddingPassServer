<template>
    <Input
      type="search"
      :placeholder="placeholder || 'Search...'"
      v-model="modelValueComputed"
      class="md:w-[100px] lg:w-[300px]"
    />
</template>

<script setup lang="ts">
import {Input} from '@/components/ui/input';
import { computed } from 'vue';

const props = defineProps<{
    modelValue: string; 
    placeholder?: string;
}>();

const emits = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
  get() {
    return props.modelValue;
  },
  set(val : string) {
    emits('update:modelValue', val);
  }
})
</script>