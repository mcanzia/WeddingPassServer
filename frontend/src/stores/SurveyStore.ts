import { Survey } from "@/models/Survey";
import { SurveyComponent } from "@/models/SurveyComponent";
import { defineStore } from "pinia";
import { Component, computed, markRaw, ref } from "vue";
import { SurveyDisplayComponent } from "@/models/SurveyDisplayComponent";
import {v4 as uuid} from 'uuid';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SingleSelectDropdown from '@/components/common/SingleSelectDropdown.vue';
import MultiSelectCombobox from '@/components/common/MultiSelectCombobox.vue';
import GuestSelect from '@/components/common/GuestSelect.vue';
import EventSelect from '@/components/common/EventSelect.vue';

type ComponentMap = Map<string, Component>;

const surveyComponentMap: ComponentMap = new Map<string, Component>([
    ['TEXT', markRaw(Input) as Component],
    ['LARGE_TEXT', markRaw(Textarea) as Component],
    ['INFO_FIELD', markRaw(Label) as Component],
    ['SINGLE_SELECT', markRaw(SingleSelectDropdown) as Component],
    ['MULTI_SELECT', markRaw(MultiSelectCombobox) as Component],
    ['GUEST_SELECT', markRaw(GuestSelect) as Component],
    ['EVENT_SELECT', markRaw(EventSelect) as Component],
  ]);

const componentsWithOptionsProp = ['SINGLE_SELECT', 'MULTI_SELECT'];

export const useSurveyStore = defineStore('surveyStore', () => {

    // state
    const survey = ref<Survey>();
    const surveyDisplayComponents = ref<SurveyDisplayComponent[]>([]);
    const previewMode = ref<boolean>(false);

    function insertSurveyDisplayComponent(surveyComponent: SurveyComponent, componentDropdownOptions?: string) {
        const newSurveyComponent : SurveyComponent = {...surveyComponent};
        if (componentDropdownOptions) {
            newSurveyComponent.options = componentDropdownOptions.split(',').filter(value => value).map(value => value.trim().toUpperCase());
        }
        newSurveyComponent.id = uuid();
        const component = surveyComponentMap.get(surveyComponent.type);
        if (!component) {
          throw new Error(`Component for type ${surveyComponent.type} not found`);
        }
        const hasOptions = hasOptionsProp(surveyComponent.type);
        const surveyDisplayComponent = new SurveyDisplayComponent(newSurveyComponent, component, hasOptions);
        surveyDisplayComponents.value.push(surveyDisplayComponent);
        survey.value?.surveyComponents.push(newSurveyComponent);
    }

    function removeSurveyComponent(componentId: string) {
        surveyDisplayComponents.value = surveyDisplayComponents.value.filter(displayComponent => displayComponent.surveyComponent.id !== componentId);
        if (survey.value) {
            const updatedComponents = survey.value.surveyComponents.filter(component => component.id !== componentId);
            survey.value.surveyComponents = updatedComponents;
        }
    }

    function hasOptionsProp(componentType : string) {
        return componentsWithOptionsProp.includes(componentType);
    }

    return {
        survey,
        surveyDisplayComponents,
        previewMode,
        insertSurveyDisplayComponent,
        removeSurveyComponent,
        hasOptionsProp
    }

});