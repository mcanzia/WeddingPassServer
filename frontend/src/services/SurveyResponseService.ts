import { SurveyController } from '@/controllers/SurveyController';
import { SurveyResponseController } from '@/controllers/SurveyResponseController';
import { Survey } from '@/models/Survey';
import { SurveyResponse } from '@/models/SurveyResponse';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class SurveyResponseService {

    private surveyResponseController: SurveyResponseController;
    private userStore: any;
    private weddingRole: WeddingRole;

    constructor() {
        this.surveyResponseController = new SurveyResponseController();
        this.userStore = useUserStore();
        this.weddingRole = this.userStore.selectedWeddingRole;
    }

    async getAllSurveyResponses(surveyId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.getAllSurveyResponses(userAccessToken, this.weddingRole, surveyId);
            const allSurveyResponses = response ? response : [];
            return allSurveyResponses;
        } catch (error) {
            throw error;
        }
    }

    async initializeSurveysForParty(guestId: string, survey: Survey) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.initializeSurveysForParty(userAccessToken, this.weddingRole, guestId, survey);
            const partySurveys = response ? response : [];
            return partySurveys;
        } catch (error) {
            throw error;
        }
    }

    async fetchPartySurveyResponses(surveyId: string, guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.fetchPartySurveyResponses(userAccessToken, this.weddingRole, surveyId, guestId);
            const partySurveys = response ? response : [];
            return partySurveys;
        } catch (error) {
            throw error;
        }
    }

    async getAllSurveyResponsesForGuest(guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyResponseController.getAllSurveyResponsesForGuest(userAccessToken, this.weddingRole, guestId);
            const allSurveyResponses = response ? response : [];
            return allSurveyResponses;
        } catch (error) {
            throw error;
        }
    }

    async getSurveyResponseById(surveyId: string, surveyResponseId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const surveyResponse = await this.surveyResponseController.getSurveyResponseById(userAccessToken, this.weddingRole, surveyId, surveyResponseId);
            return surveyResponse;
        } catch (error) {
            throw error;
        }
    }

    async getSurveyResponseByGuest(surveyId: string, guestId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const surveyResponse = await this.surveyResponseController.getSurveyResponseByGuest(userAccessToken, this.weddingRole, surveyId, guestId);
            return surveyResponse;
        } catch (error) {
            throw error;
        }
    }

    async saveSurveyResponse(surveyResponse: SurveyResponse) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedSurveyResponse = await this.surveyResponseController.saveSurveyResponse(userAccessToken, this.weddingRole, surveyResponse);
            return updatedSurveyResponse;
        } catch (error) {
            throw error;
        }
    }

    async deleteSurveyResponse(surveyId: string, surveyResponseToDelete: SurveyResponse) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.surveyResponseController.deleteSurveyResponse(userAccessToken, this.weddingRole, surveyId, surveyResponseToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

}