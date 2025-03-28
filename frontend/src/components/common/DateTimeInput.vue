<template>
    <div>
        <Popover>
            <PopoverTrigger as-child>
                <Button variant="outline" :disabled="disabled" :class="cn(
                    'w-[280px] justify-start text-left font-normal',
                    !combinedValue && 'text-muted-foreground',
                )">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ combinedValue ? calendarDateTimeToString(combinedValue) : "Pick a date time" }}
                </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
                <Calendar v-model="dateValue" initial-focus />
                <Separator />
                <TimePicker v-model:date="timeValueComputed" class="my-3 mx-2" :with-seconds="withSeconds"
                    with-period />
            </PopoverContent>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import TimePicker from "@/components/ui/time-picker/time-picker.vue";
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    type DateValue,
    DateFormatter,
    parseDateTime,
    toCalendarDateTime,
    Time,
} from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-vue-next';
import Separator from "@/components/ui/separator/Separator.vue";
import { useDateUtils } from "@/components/common/useDateUtils";

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
        default: () => ''
    },
    withSeconds: {
        type: Boolean,
        required: false,
        default: () => false
    },
    disabled: {
        type: Boolean,
        required: false,
        default: () => false
    },
});

const emits = defineEmits(['update:modelValue']);

const { calendarDateTimeToString, toISOFormat } = useDateUtils();

const modelValueComputed = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        if (val) {
            emits('update:modelValue', val);
        }
    }
});

const df = new DateFormatter('en-US', {
    dateStyle: 'long',
    timeStyle: props.withSeconds ? 'medium' : 'short',
});

const dateValue = ref<DateValue | undefined>();
const timeValue = ref<Date | null>(new Date());

const combinedValue = computed(() => {
    if (dateValue.value && timeValue.value) {
        const hour = timeValue.value.getHours();
        const minute = timeValue.value.getMinutes();
        const second = props.withSeconds ? timeValue.value.getSeconds() : 0;

        const time = new Time(hour, minute, second);
        const dateTime = toCalendarDateTime(dateValue.value as DateValue, time);

        return dateTime;
    }
    return null;
});

const timeValueComputed = computed({
    get() {
        return timeValue.value ? timeValue.value : new Date();
    },
    set(val) {
        timeValue.value = val;
    }
});

watch(combinedValue, (newVal) => {
    if (newVal) {
        modelValueComputed.value = newVal.toString();
    }
});

watch(
    modelValueComputed,
    (newVal) => {
        if (!newVal) {
            dateValue.value = undefined;
            timeValue.value = new Date();
        }
    },
    { immediate: false }
);

onMounted(async () => {
    await nextTick();
    if (props.modelValue) {
        const dateCheck = new Date(props.modelValue);
        const dateTime = parseDateTime(toISOFormat(dateCheck));
        dateValue.value = dateTime;
        timeValue.value = new Date(dateCheck);
    }
});
</script>
