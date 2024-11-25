import { Guest } from "@/models/Guest";
import { NotificationType } from "@/models/NotificationType";
import { SurveyComponent } from "@/models/SurveyComponent";
import { SurveyResponse } from "@/models/SurveyResponse";
import { GuestService } from "@/services/GuestService";
import { SurveyResponseService } from "@/services/SurveyResponseService";
import { useNotificationStore } from "@/stores/NotificationStore";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useSurveyResponseStore = defineStore('surveyResponseStore', () => {

    const notificationStore = useNotificationStore();
    const { setMessage } = notificationStore;

    const surveyResponse = ref<SurveyResponse>();
    const currentGuest = ref<Guest>();

    async function saveSurveyResponse() {
        if (surveyResponse.value) {
            try {
                // Handle guest field updates (if any)
                if (surveyResponse.value.submitted && currentGuest.value) {
                    processSurveyComponents(surveyResponse.value.responses, currentGuest.value);
                    const guestService = new GuestService();
                    await guestService.updateGuest(currentGuest.value);
                }
            } catch (error: any) {
                console.error('Error updating guest details', error);
            }
            const surveyResponseService = new SurveyResponseService();
            const updatedSurveyResponse = await surveyResponseService.saveSurveyResponse(surveyResponse.value.surveyId, surveyResponse.value);
            surveyResponse.value = updatedSurveyResponse;
            setMessage('Submitted survey response.', NotificationType.SUCCESS);
        } else {
            ErrorHandler.displayGenericError();
        }
    }

    function processSurveyComponents(components: SurveyComponent[], guest: Guest): void {
        for (const component of components) {
            if (component.infoLookupField) {
                setGuestField(guest, component.infoLookupField, component.componentValue);
            }

            if (component.surveyTriggers && component.surveyTriggers.length > 0) {
                for (const trigger of component.surveyTriggers) {
                    if (trigger.child) {
                        processSurveyComponents([trigger.child], guest);
                    }
                }
            }
        }
    }


    function setGuestField(guest: Guest, fieldKey: string, newValue: any): void {
        const fields = fieldKey.split(':');
        let value: any = guest;

        for (let i = 0; i < fields.length - 1; i++) {
            const field = fields[i];

            if (!(field in value) || typeof value[field] !== 'object' || value[field] === null) {
                value[field] = {};
            }

            value = value[field];
        }

        const lastField = fields[fields.length - 1];
        value[lastField] = newValue;
    }


    async function fetchSurveyResponse(surveyId: string, surveyResponseId: string) {
        const surveyResponseService = new SurveyResponseService();
        surveyResponse.value = await surveyResponseService.getSurveyResponseById(surveyId, surveyResponseId);
        if (surveyResponse.value && surveyResponse.value.responses) {
            surveyResponse.value.responses = surveyResponse.value.responses.sort((a, b) => a.order! - b.order!);
        }
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
                console.log('componentValue', component.label, value);
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

    return {
        //state
        surveyResponse,
        currentGuest,
        //actions
        saveSurveyResponse,
        fetchSurveyResponse,
        updateComponentValue
    }

});
