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

    const surveyResponse = ref<SurveyResponse>();
    const currentGuest = ref<Guest>();
    const partyMembers = ref<Guest[]>();

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
        } else {
            ErrorHandler.displayGenericError();
        }
    }

    async function initializeGuestValues(components: SurveyComponent[], guestId: string) {
        const guestService = new GuestService();
        currentGuest.value = await guestService.getGuestById(guestId);
        if (currentGuest.value) {
            processSurveyComponents(components, currentGuest.value);
        } else {
            ErrorHandler.handleCustomError('Guest not found.');
        }
        return components;
    }

    function processSurveyComponents(components: SurveyComponent[], guest: Guest): void {
        for (const component of components) {
            if (component.infoLookupField) {
                const fields = component.infoLookupField.split(':');
                if (!component.componentValue) {
                    component.componentValue = getGuestFieldValue(guest, fields);
                } else {
                    setGuestField(guest, fields, component.componentValue);
                }
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

    function getGuestFieldValue(guest: Guest, fields: string[]) {
        let value: any = guest;

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];

            value = value[field];
        }
        return value;
    }


    function setGuestField(guest: Guest, fields: string[], newValue: any) {
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
        return guest;
    }


    async function fetchSurveyResponse(surveyId: string, surveyResponseId: string) {
        const surveyResponseService = new SurveyResponseService();
        surveyResponse.value = await surveyResponseService.getSurveyResponseById(surveyId, surveyResponseId);
        if (surveyResponse.value && surveyResponse.value.responses) {
            surveyResponse.value.responses = surveyResponse.value.responses.sort((a, b) => a.order! - b.order!);
        }
    }

    async function fetchPartyMembers() {
        if (currentGuest.value) {
            const guestService = new GuestService();
            partyMembers.value = await guestService.fetchPartyMembers(currentGuest.value!.id!);
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
        updateComponentValue,
        initializeGuestValues
    }

});
