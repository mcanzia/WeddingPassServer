<template>
    <div>
        <Popover>
            <PopoverTrigger as-child>
                <Button variant="outline" :class="cn(
                    'w-[280px] justify-start text-left font-normal',
                    !combinedValue && 'text-muted-foreground',
                )">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ combinedValue ? formatCalendarDateTime(combinedValue) : "Pick a date time" }}
                </Button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-0">
                <Calendar v-model="dateValue" initial-focus />
                <Separator />
                <TimePicker v-model:date="timeValue" class="my-3 mx-2" :with-seconds="withSeconds" with-period />
            </PopoverContent>
        </Popover>
    </div>
</template>

<script setup lang="ts">
import TimePicker from "@/components/ui/time-picker/time-picker.vue";
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    type DateValue,
    DateFormatter,
    parseDateTime,
    toCalendarDateTime,
    Time,
    CalendarDateTime,
} from '@internationalized/date';
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import Separator from "@/components/ui/separator/Separator.vue";

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
});

const emits = defineEmits(['update:modelValue']);

onMounted(async () => {
    await nextTick();
    if (props.modelValue) {
        const dateCheck = new Date(props.modelValue);
        const dateTime = parseDateTime(toISOFormat(dateCheck));
        dateValue.value = dateTime;
        timeValue.value = new Date(dateCheck);
    }
});


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

const dateValue = ref<DateValue>();
const timeValue = ref<Date>();

const combinedValue = computed(() => {
    if (dateValue.value && timeValue.value) {
        const hour = timeValue.value.getHours();
        const minute = timeValue.value.getMinutes();
        const second = props.withSeconds ? timeValue.value.getSeconds() : 0;

        const time = new Time(hour, minute, second);
        const dateTime = toCalendarDateTime(dateValue.value, time);

        return dateTime;
    }
    return null;
});

watch(combinedValue, (newVal) => {
    if (newVal) {
        modelValueComputed.value = newVal.toString();
    }
});

function toISOFormat(date: Date) {
    const pad = (num: number, size = 2) => String(num).padStart(size, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const ms = pad(date.getMilliseconds(), 3);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${ms}`;
}

function formatCalendarDateTime(calendarDateTime: CalendarDateTime) {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = calendarDateTime.year;
    const monthName = monthNames[calendarDateTime.month - 1];
    const day = calendarDateTime.day;

    let hour = calendarDateTime.hour;
    const minute = calendarDateTime.minute;

    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;

    const minuteStr = minute > 0 ? `:${String(minute).padStart(2, '0')}` : '';

    return `${monthName} ${day}, ${year} at ${hour}${minuteStr} ${period}`;
}




</script>