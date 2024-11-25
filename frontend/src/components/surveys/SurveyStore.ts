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
import { camelCase } from "lodash";
import SurveyGuestDetailField from "@/components/surveys/SurveyGuestDetailField.vue";
import { SurveyTrigger } from "@/models/SurveyTrigger";
import { SurveyResponse } from "@/models/SurveyResponse";
import { useSurveyFieldLookup } from "@/components/surveys/useSurveyFieldLookup";
type ComponentMap = Map<string, Component>;

const surveyComponentMap: ComponentMap = new Map<string, Component>([
    ['TEXT', markRaw(Input) as Component],
    ['LARGE_TEXT', markRaw(Textarea) as Component],
    ['INFO_FIELD', markRaw(SurveyInfoField) as Component],
    ['GUEST_DETAIL_FIELD', markRaw(SurveyGuestDetailField) as Component],
    ['SINGLE_SELECT', markRaw(SingleSelectDropdown) as Component],
    ['MULTI_SELECT', markRaw(MultiSelectCombobox) as Component],
    ['GUEST_SELECT', markRaw(GuestSelect) as Component],
    ['EVENT_SELECT', markRaw(EventSelect) as Component],
]);

const componentsWithOptionsProp = ['SINGLE_SELECT', 'MULTI_SELECT'];
const componentsWithPredefinedValue = ['INFO_FIELD'];
const componentsWithDetailDropdown = ['GUEST_DETAIL_FIELD'];
const componentsWithEditableInfoToggle = ['INFO_FIELD', 'GUEST_DETAIL_FIELD'];
const componentsWithAddChildMode = ['SINGLE_SELECT'];

export const useSurveyStore = defineStore('surveyStore', () => {

    const notificationStore = useNotificationStore();
    const { setMessage } = notificationStore;
    const { hasEditAuthority } = storeToRefs(useUserStore());
    // state
    const survey = ref<Survey>();
    const componentDropdownOptions = ref<string | null>();
    const predefinedValue = ref<string | null>();
    const infoLookupField = ref<string | null>();
    const editableInfo = ref<boolean>(false);
    const parentFieldId = ref<string | null>();
    const parentTriggerField = ref<string | null>();
    const previewMode = ref<boolean>(false);
    const savedStatus = ref<boolean>(true);

    const parentSelectOptions = computed(() => {
        if (parentFieldId.value && survey.value && survey.value.surveyComponents) {
            const parentComponent = findComponentById(survey.value.surveyComponents, parentFieldId.value);
            if (parentComponent && parentComponent.options) {
                return parentComponent.options;
            }
        }
        return [];
    });

    function insertSurveyDisplayComponent(surveyComponent: SurveyComponent) {
        const newSurveyComponent: SurveyComponent = { ...surveyComponent };
        newSurveyComponent.id = uuid();

        if (componentDropdownOptions.value) {
            newSurveyComponent.options = componentDropdownOptions.value
                .split(',')
                .filter((value) => value)
                .map((value) => value.trim().toUpperCase());
        }
        if (predefinedValue.value) {
            newSurveyComponent.componentValue = predefinedValue.value;
        }
        if (infoLookupField.value) {
            const fieldLookup = infoLookupField.value
                .split(':')
                .map(part => camelCase(part.trim()))
                .join(':');

            newSurveyComponent.infoLookupField = fieldLookup;
        }
        if (survey.value) {
            newSurveyComponent.order = survey.value.surveyComponents.length;
        }
        if (editableInfo.value) {
            newSurveyComponent.editableInfo = editableInfo.value;
        }

        if (parentFieldId.value && parentTriggerField.value) {
            const newSurveyTrigger = new SurveyTrigger(parentTriggerField.value, newSurveyComponent);
            if (survey.value && survey.value.surveyComponents) {
                const parentComponent = findComponentById(survey.value.surveyComponents, parentFieldId.value);
                if (parentComponent) {
                    if (!parentComponent.surveyTriggers) {
                        parentComponent.surveyTriggers = [];
                    }
                    parentComponent.surveyTriggers.push(newSurveyTrigger);
                } else {
                    console.error(`Parent component with id ${parentFieldId.value} not found.`);
                }
            }
        } else {
            survey.value?.surveyComponents.push(newSurveyComponent);
        }
    }

    function removeSurveyComponent(components: SurveyComponent[], componentId: string, parentId?: string) {
        for (let i = 0; i < components.length; i++) {
            const component = components[i];

            if (component.id === componentId) {
                components.splice(i, 1);
                return true;
            }

            if (component.surveyTriggers) {
                for (const trigger of component.surveyTriggers) {
                    if (component.id === parentId) {
                        const index = component.surveyTriggers.findIndex(
                            (t) => t.child.id === componentId
                        );
                        if (index !== -1) {
                            component.surveyTriggers.splice(index, 1);
                            return true;
                        }
                    } else {
                        const found = removeSurveyComponent(
                            [trigger.child],
                            componentId,
                            parentId
                        );
                        if (found) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    function findComponentById(components: SurveyComponent[], id: string): SurveyComponent | null {
        for (const component of components) {
            if (component.id === id) {
                return component;
            }
            if (component.surveyTriggers) {
                for (const trigger of component.surveyTriggers) {
                    const found = findComponentById([trigger.child], id);
                    if (found) {
                        return found;
                    }
                }
            }
        }
        return null;
    }

    function openAddChild(componentId: string) {
        parentFieldId.value = componentId;
    }

    function updateComponentValue(
        components: SurveyComponent[],
        componentId: string,
        value: any
    ): boolean {
        for (const component of components) {
            if (component.id === componentId) {
                component.componentValue = value;
                clearChildValues(component);
                return true;
            }
            if (component.surveyTriggers) {
                for (const trigger of component.surveyTriggers) {
                    const found = updateComponentValue(
                        [trigger.child],
                        componentId,
                        value,
                    );
                    if (found) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function clearChildValues(component: SurveyComponent) {
        if (component.surveyTriggers) {
            for (const trigger of component.surveyTriggers) {
                const childComponent = trigger.child;
                childComponent.componentValue = null;
                clearChildValues(childComponent);
            }
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
            survey.value.surveyComponents = survey.value.surveyComponents.sort((a, b) => a.order! - b.order!);
        }
    }

    function findSurveyDisplayComponent(surveyComponentType: string) {
        return surveyComponentMap.get(surveyComponentType);
    }

    function hasOptionsProp(componentType: string) {
        return componentsWithOptionsProp.includes(componentType);
    }

    function hasPredefinedValue(componentType: string) {
        return componentsWithPredefinedValue.includes(componentType);
    }

    function hasDetailDropdown(componentType: string) {
        return componentsWithDetailDropdown.includes(componentType);
    }

    function hasEditableInfoToggle(componentType: string) {
        return componentsWithEditableInfoToggle.includes(componentType);
    }

    function hasAddChildButton(componentType: string) {
        return componentsWithAddChildMode.includes(componentType);
    }

    function updateComponentsOrder() {
        if (survey.value && survey.value.surveyComponents) {
            const updatedComponents = survey.value.surveyComponents.map((surveyComponent, index) => {
                return { ...surveyComponent, order: index }
            });
            survey.value.surveyComponents = updatedComponents;
            savedStatus.value = false;
        }
    }

    function togglePreviewMode() {
        previewMode.value = !previewMode.value;
    }

    return {
        survey,
        previewMode,
        parentFieldId,
        parentTriggerField,
        componentDropdownOptions,
        predefinedValue,
        infoLookupField,
        editableInfo,
        savedStatus,
        parentSelectOptions,
        insertSurveyDisplayComponent,
        removeSurveyComponent,
        hasOptionsProp,
        hasPredefinedValue,
        saveSurvey,
        fetchSurvey,
        updateComponentsOrder,
        hasDetailDropdown,
        hasEditableInfoToggle,
        hasAddChildButton,
        togglePreviewMode,
        findSurveyDisplayComponent,
        openAddChild,
        updateComponentValue
    }

});