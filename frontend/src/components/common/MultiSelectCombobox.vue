<template>
    <TagsInput class="px-0 gap-0" :model-value="modelValueComputed">
        <div class="flex gap-2 flex-wrap items-center px-3">
            <TagsInputItem v-for="item in modelValueComputed" :key="item" :value="item">
                <TagsInputItemText />
                <TagsInputItemDelete />
            </TagsInputItem>
        </div>

        <ComboboxRoot v-model="modelValueComputed" v-model:open="open" v-model:search-term="searchTerm" class="w-full">
            <ComboboxAnchor as-child>
                <ComboboxInput as-child @focus="open = true">
                    <TagsInputInput class="w-full px-3" :class="modelValue.length > 0 ? 'mt-2' : ''"
                        @keydown.enter.prevent />
                </ComboboxInput>
            </ComboboxAnchor>

            <ComboboxPortal>
                <ComboboxContent>
                    <CommandList position="popper"
                        class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
                        <CommandEmpty />
                        <CommandGroup>
                            <CommandItem v-for="(selectOption) in filteredOptions" :key="selectOption"
                                :value="selectOption" @select.prevent="(ev) => {
                                    if (typeof ev.detail.value === 'string') {
                                        searchTerm = ''
                                        modelValueComputed.push(ev.detail.value)
                                    }

                                    if (filteredOptions.length === 0) {
                                        open = false
                                    }
                                }">
                                {{ selectOption }}
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </ComboboxContent>
            </ComboboxPortal>
        </ComboboxRoot>
    </TagsInput>
</template>

<script setup lang="ts">

import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { TagsInput, TagsInputInput, TagsInputItem, TagsInputItemDelete, TagsInputItemText } from '@/components/ui/tags-input'
import { ComboboxAnchor, ComboboxContent, ComboboxInput, ComboboxPortal, ComboboxRoot } from 'radix-vue'
import { computed, PropType, ref } from 'vue'

const props = defineProps({
    selectOptions: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    },
    modelValue: {
        type: Array as PropType<string[]>,
        required: false,
        default: () => []
    }

});

const emit = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emit('update:modelValue', val);
    }
});

const open = ref(false)
const searchTerm = ref('')

const filteredOptions = computed(() =>
  props.selectOptions.filter((i) => !modelValueComputed.value.includes(i) && i.toLowerCase().includes(searchTerm.value.toLowerCase()))
);
</script>