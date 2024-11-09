import { Survey } from "@/models/Survey";
import { SurveyComponent } from "@/models/SurveyComponent";
import { defineStore, storeToRefs } from "pinia";
import { Component, computed, markRaw, nextTick, ref } from "vue";
import { SurveyDisplayComponent } from "@/models/SurveyDisplayComponent";
import { v4 as uuid } from 'uuid';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SingleSelectDropdown from '@/components/common/SingleSelectDropdown.vue';
import MultiSelectCombobox from '@/components/common/MultiSelectCombobox.vue';
import GuestSelect from '@/components/common/GuestSelect.vue';
import EventSelect from '@/components/common/EventSelect.vue';
import { useNotificationStore } from "@/stores/NotificationStore";
import { useUserStore } from "@/stores/UserStore";
import { SurveyService } from "@/services/SurveyService";
import { NotificationType } from "@/models/NotificationType";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import SurveyInfoField from "@/components/surveys/SurveyInfoField.vue";
import { Guest } from "@/models/Guest";
import { startCase } from "lodash";
type ComponentMap = Map<string, Component>;

const surveyComponentMap: ComponentMap = new Map<string, Component>([
    ['TEXT', markRaw(Input) as Component],
    ['LARGE_TEXT', markRaw(Textarea) as Component],
    ['INFO_FIELD', markRaw(SurveyInfoField) as Component],
    ['GUEST_DETAIL_FIELD', markRaw(SurveyInfoField) as Component],
    ['SINGLE_SELECT', markRaw(SingleSelectDropdown) as Component],
    ['MULTI_SELECT', markRaw(MultiSelectCombobox) as Component],
    ['GUEST_SELECT', markRaw(GuestSelect) as Component],
    ['EVENT_SELECT', markRaw(EventSelect) as Component],
]);

const componentsWithOptionsProp = ['SINGLE_SELECT', 'MULTI_SELECT'];
const componentsWithPredefinedValue = ['INFO_FIELD'];

export const useSurveyStore = defineStore('surveyStore', () => {

    const notificationStore = useNotificationStore();
    const { setMessage } = notificationStore;
    const { hasEditAuthority } = storeToRefs(useUserStore());
    // state
    const survey = ref<Survey>();
    const surveyDisplayComponents = ref<SurveyDisplayComponent[]>([]);
    const componentDropdownOptions = ref<string | null>();
    const predefinedValue = ref<string | null>();
    const previewMode = ref<boolean>(false);
    const savedStatus = ref<boolean>(true);

    const formattedGuestDetailKeys = computed(() => {
        return Guest.detailKeys.map(key => startCase(key));
    });

    function insertSurveyDisplayComponent(surveyComponent: SurveyComponent) {
        const newSurveyComponent: SurveyComponent = { ...surveyComponent };
        if (componentDropdownOptions.value) {
            newSurveyComponent.options = componentDropdownOptions.value.split(',').filter(value => value).map(value => value.trim().toUpperCase());
        }
        if (predefinedValue.value) {
            newSurveyComponent.value = predefinedValue.value;
        }
        newSurveyComponent.id = uuid();
        if (survey.value) {
            newSurveyComponent.order = survey.value.surveyComponents.length;
        }
        const surveyDisplayComponent : SurveyDisplayComponent = createSurveyDisplayComponent(newSurveyComponent);
        surveyDisplayComponents.value.push(surveyDisplayComponent);
        survey.value?.surveyComponents.push(newSurveyComponent);
    }

    function removeSurveyComponent(componentId: string) {
        surveyDisplayComponents.value = surveyDisplayComponents.value.filter(displayComponent => displayComponent.surveyComponent.id !== componentId);
        if (survey.value) {
            updateComponentsOrder();
        }
    }

    async function saveSurvey() {
        if (hasEditAuthority && survey.value) {
            const surveyService = new SurveyService();
            const updatedSurvey = await surveyService.saveSurvey(survey.value);
            survey.value = updatedSurvey;
            setMessage('Saved survey.', NotificationType.SUCCESS);
            savedStatus.value = true;
        } else {
            ErrorHandler.handleAuthorizationError();
        }
    }

    async function fetchSurvey(surveyId: string) {
        const surveyService = new SurveyService();
        survey.value = await surveyService.getSurveyById(surveyId);
        if (survey.value && survey.value.surveyComponents) {
            survey.value.surveyComponents = survey.value.surveyComponents.sort((a,b) => a.order - b.order);
            setSurveyDisplayComponents();
        }
    }

    function setSurveyDisplayComponents() {
        if (survey.value && survey.value.surveyComponents) {
            for (let surveyComponent of survey.value.surveyComponents) {
                const surveyDisplayComponent : SurveyDisplayComponent = createSurveyDisplayComponent(surveyComponent);
                surveyDisplayComponents.value.push(surveyDisplayComponent);
            }
        }
    }

    function createSurveyDisplayComponent(surveyComponent : SurveyComponent) {
        const component = surveyComponentMap.get(surveyComponent.type);
        if (!component) {
            throw new Error(`Component for type ${surveyComponent.type} not found`);
        }
        const hasOptions = hasOptionsProp(surveyComponent.type);
        return new SurveyDisplayComponent(surveyComponent, component, hasOptions);
    }

    function hasOptionsProp(componentType: string) {
        return componentsWithOptionsProp.includes(componentType);
    }

    function hasPredefinedValue(componentType: string) {
        return componentsWithPredefinedValue.includes(componentType);
    }

    function updateComponentsOrder() {
        if (survey.value && survey.value.surveyComponents) {
            const updatedComponents = surveyDisplayComponents.value.map((sdc, index) => {
                return {...sdc.surveyComponent, order: index}
            });
            survey.value.surveyComponents = updatedComponents;
            savedStatus.value = false;
        }
    }

    return {
        survey,
        surveyDisplayComponents,
        previewMode,
        componentDropdownOptions,
        predefinedValue,
        savedStatus,
        formattedGuestDetailKeys,
        insertSurveyDisplayComponent,
        removeSurveyComponent,
        hasOptionsProp,
        hasPredefinedValue,
        saveSurvey,
        fetchSurvey,
        updateComponentsOrder
    }

});