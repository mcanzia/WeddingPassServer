<template>
    <div class="grid grid-flow-row-dense grid-cols-6">
        <div class="col-span-1 flex flex-col items-center justify-center space-y-2">
            <IconButton icon="caret-up" />
            <IconButton icon="caret-down" />
        </div>
        <div class="grid gap-2 col-span-4">
            <input v-model="componentLabel" placeholder="Enter Field Title Here"
                class="bg-inherit border-0 outline-transparent" />
            <slot></slot>
        </div>
        <div class="col-span-1 flex items-center justify-center">
            <IconButton icon="close" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import IconButton from '@/components/common/IconButton.vue';

defineProps({
    builderMode: {
        type: Boolean,
        required: false,
        default: () => false
    },
    componentDetails: {
        type: Object,
        required: false,
        default: () => { }
    }

});

const componentLabel = ref('');


</script>