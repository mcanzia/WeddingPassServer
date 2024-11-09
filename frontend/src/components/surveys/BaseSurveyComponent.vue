<template>
    <div>
        <SurveyComponentWrapper v-if="builderMode" @remove="removeComponent" v-model:component-label="componentDetails.label">
            <div class="w-full">
                <Component :is="displayComponent" v-model="modelValueComputed" v-bind="componentProps" />
            </div>
        </SurveyComponentWrapper>
        <div class="flex flex-col gap-2 w-full" v-else>
            <Label>{{ componentDetails.label }}</Label>
            <Component :is="displayComponent" v-model="modelValueComputed" v-bind="componentProps"/>
        </div>
    </div>

</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label';
import SurveyComponentWrapper from '@/components/surveys/SurveyComponentWrapper.vue';
import { SurveyComponent } from '@/models/SurveyComponent';
import { computed, PropType } from 'vue';

const emit = defineEmits(['remove', 'update:modelValue']);

const props = defineProps({
    builderMode: {
        type: Boolean,
        required: false,
        default: () => false
    },
    componentDetails: {
        type: Object as PropType<SurveyComponent>,
        required: true,
    },
    displayComponent: {
        required: true
    },
    hasOptions: {
        type: Boolean,
        required: false,
        default: () => false
    }
    
});

const modelValueComputed = computed({
    get() {
        return props.componentDetails.value;
    },
    set(val) {
        emit('update:modelValue', val);
    }
})

const componentProps = computed(() => {
  const propsToPass: Record<string, any> = {};

  if (props.hasOptions) {
    propsToPass['selectOptions'] = props.componentDetails.options;
  }

  return propsToPass;
});

function removeComponent() {
    emit('remove', props.componentDetails.id);
}

</script>