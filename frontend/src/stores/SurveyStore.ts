import { Survey } from "@/models/Survey";
import { SurveyComponent } from "@/models/SurveyComponent";
import SurveyTextInput from "@/components/surveys/SurveyTextInput.vue";
import SurveyTextbox from "@/components/surveys/SurveyTextbox.vue";
import SurveySingleSelect from "@/components/surveys/SurveySingleSelect.vue";
import { defineStore } from "pinia";
import { ref } from "vue";
import { SurveyDisplayComponent } from "@/models/SurveyDisplayComponent";

const surveyComponentMap = new Map([
    ['TEXT', SurveyTextInput],
    ['LARGE_TEXT', SurveyTextbox],
    ['SINGLE_SELECT', SurveySingleSelect],
  ]);

export const useSurveyStore = defineStore('surveyStore', () => {

    // state
    const survey = ref<Survey>();
    const surveyDisplayComponents = ref<SurveyDisplayComponent[]>([]);

    function insertSurveyDisplayComponent(surveyComponent: SurveyComponent, componentDropdownOptions?: string) {
        if (componentDropdownOptions) {
            surveyComponent.options = componentDropdownOptions.split(',').filter(value => value).map(value => value.trim().toUpperCase());
        }
        const surveyDisplayComponent = new SurveyDisplayComponent(surveyComponent, surveyComponentMap.get(surveyComponent.type));
        surveyDisplayComponents.value.push(surveyDisplayComponent);
        survey.value?.surveyComponents.push(surveyComponent);
    }

    return {
        survey,
        surveyDisplayComponents,
        insertSurveyDisplayComponent
    }

});