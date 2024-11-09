<template>
        <div class="grid grid-flow-row-dense grid-cols-6">
            <div class="col-span-1 flex flex-col items-center justify-center space-y-2">
                <ion-icon name="ellipsis-vertical" class="kanban-handle cursor-pointer"></ion-icon>
                <!-- <IconButton icon="caret-up" />
            <IconButton icon="caret-down" /> -->
            </div>
            <div class="grid gap-2 col-span-4">
                <input v-model="componentLabelComputed" placeholder="Enter Field Title Here"
                    class="bg-inherit border-0 outline-transparent" />
                <slot></slot>
            </div>
            <div class="col-span-1 flex justify-center">
                <IconButton @click="remove" icon="close" />
            </div>
        </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import IconButton from '@/components/common/IconButton.vue';

const emit = defineEmits(['remove', 'update:componentLabel']);

const props = defineProps({
    componentLabel: {
        type: String,
        required: false,
        default: () => ''
    },

});

const componentLabelComputed = computed({
    get() {
        return props.componentLabel;
    },
    set(val) {
        emit('update:componentLabel', val);
    }
})

function remove() {
    emit('remove');
}


</script>