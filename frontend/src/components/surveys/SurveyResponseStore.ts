import { Guest } from "@/models/Guest";
import { NotificationType } from "@/models/NotificationType";
import { Survey } from "@/models/Survey";
import { SurveyComponent } from "@/models/SurveyComponent";
import { SurveyResponse } from "@/models/SurveyResponse";
import { GuestService } from "@/services/GuestService";
import { SurveyResponseService } from "@/services/SurveyResponseService";
import { useNotificationStore } from "@/stores/NotificationStore";
import { ErrorHandler } from "@/util/error/ErrorHandler";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useSurveyResponseStore = defineStore('surveyResponseStore', () => {

    const surveyResponses = ref<SurveyResponse[]>();
    const currentSurveyResponse = ref<SurveyResponse>();

    const partyMembers = computed(() => {
        return surveyResponses.value?.map(surveyResponse => surveyResponse.guest);
    });

    const currentSurveyStatus = computed(() => {
        return currentSurveyResponse.value?.submitted ? 'Survey Submitted' : 'Survey In Progress';
    });

    async function saveSurveyResponse() {
        if (currentSurveyResponse.value) {
            try {
                // Handle guest field updates (if any)
                if (currentSurveyResponse.value.submitted && currentSurveyResponse.value) {
                    processSurveyComponents(currentSurveyResponse.value.survey.surveyComponents, currentSurveyResponse.value.guest);
                    const guestService = new GuestService();
                    await guestService.updateGuest(currentSurveyResponse.value.guest);
                }
            } catch (error: any) {
                console.error('Error updating guest details', error);
            }
            const surveyResponseService = new SurveyResponseService();
            const updatedSurveyResponse = await surveyResponseService.saveSurveyResponse(currentSurveyResponse.value);
            currentSurveyResponse.value = updatedSurveyResponse;
            const updateIndex = surveyResponses.value?.findIndex(surveyResponse => surveyResponse.responseId === currentSurveyResponse.value?.responseId);
            if (updateIndex) {
                surveyResponses.value![updateIndex] = updatedSurveyResponse;
            }
        } else {
            ErrorHandler.displayGenericError();
        }
    }

    async function initializeSurveysForParty(guestId: string, survey: Survey) {
        const surveyResponseService = new SurveyResponseService();
        surveyResponses.value = await surveyResponseService.initializeSurveysForParty(guestId, survey);
        if (surveyResponses.value) {
            currentSurveyResponse.value = surveyResponses.value.find(surveyResponse => surveyResponse.guest.id === guestId);
        }
    }

    function processSurveyComponents(components: SurveyComponent[], guest: Guest): void {
        for (const component of components) {
            if (component.infoLookupField) {
                const fields = component.infoLookupField.split(':');
                if (component.componentValue) {
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
    }


    async function fetchPartySurveyResponses(surveyId: string, guestId: string, surveyResponseId: string) {
        const surveyResponseService = new SurveyResponseService();
        surveyResponses.value = await surveyResponseService.fetchPartySurveyResponses(surveyId, guestId);
        currentSurveyResponse.value = surveyResponses.value?.find(surveyResponse => surveyResponse.responseId === surveyResponseId);
        // if (surveyResponse.value && surveyResponse.value.survey.surveyComponents) {
        //     surveyResponse.value.survey.surveyComponents = surveyResponse.value.survey.surveyComponents.sort((a, b) => a.order! - b.order!);
        // }
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
        surveyResponses,
        currentSurveyResponse,
        partyMembers,
        currentSurveyStatus,
        //actions
        saveSurveyResponse,
        fetchPartySurveyResponses,
        updateComponentValue,
        initializeSurveysForParty
    }

});
