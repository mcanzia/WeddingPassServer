<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'

const inputRef = ref<HTMLInputElement | null>(null);

const props = defineProps<{
  defaultValue?: string | number
  modelValue?: string | number
  maxLength?: number
  minLength?: number
  class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

defineExpose({inputRef});

const modelValue = useVModel(props, 'modelValue', emits, {
  passive: true,
  defaultValue: props.defaultValue,
})
</script>

<template>
  <input ref="inputRef" v-model="modelValue" :maxlength="maxLength" :minlength="minLength"  :class="cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', props.class)">
</template>
