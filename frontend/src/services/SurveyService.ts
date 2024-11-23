import { SurveyController } from '@/controllers/SurveyController';
import { Survey } from '@/models/Survey';
import { WeddingRole } from '@/models/WeddingRole';
import { useUserStore } from '@/stores/UserStore';

export class SurveyService {

    private surveyController: SurveyController;
    private userStore: any;
    private weddingRole: WeddingRole;

    constructor() {
        this.surveyController = new SurveyController();
        this.userStore = useUserStore();
        this.weddingRole = this.userStore.selectedWeddingRole;
    }

    async getAllSurveys() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyController.getAllSurveys(userAccessToken, this.weddingRole);
            const allSurveys = response ? response : [];
            return allSurveys;
        } catch (error) {
            throw error;
        }
    }

    async getPublishedSurveys() {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const response = await this.surveyController.getPublishedSurveys(userAccessToken, this.weddingRole);
            const publishedSurveys = response ? response : [];
            return publishedSurveys;
        } catch (error) {
            throw error;
        }
    }

    async getSurveyById(surveyId: string) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const survey = await this.surveyController.getSurveyById(userAccessToken, this.weddingRole, surveyId);
            return survey;
        } catch (error) {
            throw error;
        }
    }

    async saveSurvey(survey: Survey) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            const updatedSurvey = await this.surveyController.saveSurvey(userAccessToken, this.weddingRole, survey);
            return updatedSurvey;
        } catch (error) {
            throw error;
        }
    }

    async deleteSurvey(surveyToDelete: Survey) {
        try {
            const userAccessToken = await this.userStore.getAccessToken();
            await this.surveyController.deleteSurvey(userAccessToken, this.weddingRole, surveyToDelete);
            return;
        } catch (error) {
            throw error;
        }
    }

}