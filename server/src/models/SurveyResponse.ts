import { SurveyComponent } from "./SurveyComponent";

export class SurveyResponse {

    responseId: string;
    surveyId: string;
    weddingId: string;
    guestId: string;
    responses: SurveyComponent[];
    updatedAt: Date;
    submitted: boolean;
    title: string;

    constructor(responseId: string, surveyId: string, weddingId: string, guestId: string, responses: SurveyComponent[], updatedAt: Date, submitted: boolean, title: string) {
        this.surveyId = surveyId;
        this.responseId = responseId;
        this.weddingId = weddingId;
        this.guestId = guestId;
        this.responses = responses;
        this.updatedAt = updatedAt;
        this.submitted = submitted;
        this.title = title;
    }

    toObject?() {
        return {
            surveyId: this.surveyId,
            responseId: this.responseId,
            weddingId: this.weddingId,
            guestId: this.guestId,
            responses: this.responses?.map(response => response.toObject ? response.toObject() : response),
            updatedAt: this.updatedAt,
            submitted: this.submitted,
            title: this.title
        };
    }
}