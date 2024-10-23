<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" :class="cn('flex align-center', classes)">
                <ion-icon :name="icon" class="size-6"></ion-icon>
                <span v-if="extraText" class="ml-2">{{ extraText }}</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <slot />
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

defineProps({
    icon: {
        type: String,
        required: true,
    },
    extraText: {
        type: String,
        required: false,
        default: () => null
    },
    classes: {
        type: String,
        required: false,
        default: () => null,
    },
});

</script>

<style scoped></style>