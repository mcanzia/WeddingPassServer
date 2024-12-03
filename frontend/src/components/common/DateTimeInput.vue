<template>
    <div>
        <Popover>
            <PopoverTrigger as-child>
                <Button variant="outline" :class="cn(
                    'w-[280px] justify-start text-left font-normal',
                    !combinedValue && 'text-muted-foreground',
                )">
                    <CalendarIcon class="mr-2 h-4 w-4" />
                    {{ combinedValue ? df.format(combinedValue.toDate(getLocalTimeZone())) : "Pick a date time" }}
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
import { computed, onMounted, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
    type DateValue,
    DateFormatter,
    getLocalTimeZone,
    parseDateTime,
    toCalendarDateTime,
    Time,
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

onMounted(() => {
    if (props.modelValue) {
        const dateTime = parseDateTime(props.modelValue);
        dateValue.value = dateTime;

        const timeDate = dateTime.toDate(getLocalTimeZone());
        timeValue.value = timeDate;
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


</script>