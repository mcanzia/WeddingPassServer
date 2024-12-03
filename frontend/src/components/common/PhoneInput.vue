<template>
    <PhoneInput noUseBrowserLocale :preferredCountries="preferredCountries" fetchCountry
        :countryCode="selectedCountryCode" @update:country-code="handleCountryCodeUpdate" v-model="modelValueComputed"
        class="flex" country-locale="en-EN" :ignored-countries="['AC']">
        <template #selector="{ inputValue, updateInputValue, countries }">
            <Popover v-model:open="open">
                <PopoverTrigger :disabled="disabled">
                    <Button :disabled="disabled" variant="outline" class="flex gap-1 rounded-e-none rounded-s-lg px-4">
                        <span class="text-foreground/50 text-sm">{{
                            countryPhoneCode
                            }}</span>
                        <FlagComponent :country="inputValue" />
                        <ChevronsUpDown class="-mr-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[300px] p-0" side="bottom" :avoid-collisions="false">
                    <Command>
                        <CommandInput placeholder="Search country..." />
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandList>
                            <CommandGroup>
                                <CommandItem v-for="option in countries" :key="option.iso2" :value="option.name"
                                    class="gap-2" @select="() => {
                                        updateInputValue(option.iso2)
                                        open = false
                                        focused = true
                                    }
                                        ">
                                    <FlagComponent :country="option?.iso2" />
                                    <span class="flex-1 text-sm">{{
                                        option.name
                                    }}</span>
                                    <span class="text-foreground/50 text-sm">{{
                                        option.dialCode
                                    }}</span>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </template>

        <template #input="{ inputValue, updateInputValue, placeholder }">
            <Input :disabled="disabled" ref="phoneInput" class="rounded-e-lg rounded-s-none" type="text" :maxLength="20"
                :model-value="inputValue" @input="updateInputValue" :placeholder="placeholder" />
        </template>
    </PhoneInput>
</template>

<script setup lang="ts">
import PhoneInput from 'base-vue-phone-input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList
} from '@/components/ui/command';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFocus } from '@vueuse/core'
import { ChevronsUpDown } from 'lucide-vue-next'
import FlagComponent from '@/components/common/FlagComponent.vue';
import { computed, ref } from 'vue';
import countryPhoneData from '@/assets/countries_phone_number_length.json';

const props = defineProps({
    initialCountry: {
        type: String,
        required: false,
        default: () => 'US'
    },
    modelValue: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        required: false,
        default: () => false
    },
    preferredCountries: {
        type: Array,
        required: false,
        default: () => ['US']
    },
    disabled: {
        type: Boolean,
        required: false,
        default: () => false
    }
});

const open = ref(false);
const phoneInput = ref(null);
const { focused } = useFocus(phoneInput);
const selectedCountryCode = ref(props.initialCountry.toUpperCase());

const emits = defineEmits(['update:modelValue']);

const modelValueComputed = computed({
    get() {
        return props.modelValue;
    },
    set(val) {
        emits('update:modelValue', val);
    }
});

function handleCountryCodeUpdate(newCountryCode: string) {
    selectedCountryCode.value = newCountryCode.toUpperCase();
}

const countryPhoneMap = computed(() => {
    const map = new Map<string, any>();
    countryPhoneData.forEach((country: any) => {
        map.set(country.code.toUpperCase(), country);
    });
    return map;
});

const countryPhoneCode = computed(() => {
    const country = countryPhoneMap.value.get(selectedCountryCode.value);
    if (country && country.phone) {
        return `+${country.phone}`;
    }
    return undefined;
});

// const maxLengthComputed = computed(() => {
//   const maxLength = getMaxLengthForCountry(selectedCountryCode.value);
//   if (maxLength) {
//     return maxLength;
//   }
//   return undefined;
// });

// function getMaxLengthForCountry(countryCode: string): number | undefined {
//   const countryData = countryPhoneMap.value.get(countryCode.toUpperCase());
//   if (!countryData) {
//     console.error(`Country code ${countryCode} not found in data.`);
//     return undefined;
//   }

//   if (Array.isArray(countryData.phoneLength)) {
//     return Math.max(...countryData.phoneLength);
//   } else if (typeof countryData.phoneLength === 'number') {
//     return countryData.phoneLength;
//   } else if (countryData.min && countryData.max) {
//     return countryData.max;
//   } else {
//     console.error(`Invalid phone length data for country code ${countryCode}.`);
//     return undefined;
//   }
// }

</script>