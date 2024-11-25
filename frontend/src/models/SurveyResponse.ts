import { SurveyComponent } from "./SurveyComponent";

export class SurveyResponse {

    responseId?: string;
    surveyId: string;
    weddingId: string;
    guestId: string;
    responses: SurveyComponent[];
    updatedAt: Date;
    submitted: boolean;
    title: string;

    constructor(surveyId: string, weddingId: string, guestId: string, responses: SurveyComponent[], updatedAt: Date, submitted: boolean, title: string, responseId?: string) {
        this.responseId = responseId;
        this.surveyId = surveyId;
        this.weddingId = weddingId;
        this.guestId = guestId;
        this.responses = responses;
        this.updatedAt = updatedAt;
        this.submitted = submitted;
        this.title = title;
    }

}