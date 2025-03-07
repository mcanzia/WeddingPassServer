import { SurveyController } from '@/controllers/SurveyController';
import { SurveyResponseController } from '@/controllers/SurveyResponseController';
import { Survey } from '@/models/Survey';
import { SurveyResponse } from '@/models/SurveyResponse';
import { EventRole } from '@/models/EventRole';
import { useUserStore } from '@/stores/UserStore';

export class SurveyResponseService {

    private surveyResponseController: SurveyResponseController;
    private userStore: any;
    private eventRole: EventRole;

    constructor() {
        this.surveyResponseController = new SurveyResponseController();
        this.userStore = useUserStore();
        this.eventRole = this.userStore.selectedEventRole;
    }

    async getAllSurveyResponses(surveyId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.getAllSurveyResponses(userAccessToken, this.eventRole, surveyId);
            const allSurveyResponses = response ? response : [];
            return allSurveyResponses;
        } catch (error) {
            throw error;
        }
    }

    async initializeSurveysForParty(guestId: string, survey: Survey) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.initializeSurveysForParty(userAccessToken, this.eventRole, guestId, survey);
            const partySurveys = response ? response : [];
            return partySurveys;
        } catch (error) {
            throw error;
        }
    }

    async fetchPartySurveyResponses(surveyId: string, guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.fetchPartySurveyResponses(userAccessToken, this.eventRole, surveyId, guestId);
            const partySurveys = response ? response : [];
            return partySurveys;
        } catch (error) {
            throw error;
        }
    }

    async getAllSurveyResponsesForGuest(guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.getAllSurveyResponsesForGuest(userAccessToken, this.eventRole, guestId);
            const allSurveyResponses = response ? response : [];
            return allSurveyResponses;
        } catch (error) {
            throw error;
        }
    }

    async getSurveyResponseById(surveyId: string, surveyResponseId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const surveyResponse = await this.surveyResponseController.getSurveyResponseById(userAccessToken, this.eventRole, surveyId, surveyResponseId);
            return surveyResponse;
        } catch (error) {
            throw error;
        }
    }

    async getSurveyResponseByGuest(surveyId: string, guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const surveyResponse = await this.surveyResponseController.getSurveyResponseByGuest(userAccessToken, this.eventRole, surveyId, guestId);
            return surveyResponse;
        } catch (error) {
            throw error;
        }
    }

    async saveSurveyResponse(surveyResponse: SurveyResponse) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedSurveyResponse = await this.surveyResponseController.saveSurveyResponse(userAccessToken, this.eventRole, surveyResponse);
            return updatedSurveyResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteSurveyResponse(surveyId: string, surveyResponseToDelete: SurveyResponse) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.surveyResponseController.deleteSurveyResponse(userAccessToken, this.eventRole, surveyId, surveyResponseToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

}