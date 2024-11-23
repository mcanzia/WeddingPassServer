import { SurveyComponent } from "./SurveyComponent";

export class SurveyResponse {

    responseId: string;
    surveyId: string;
    guestId: string;
    responses: SurveyComponent[];
    updatedAt: Date;
    submitted: boolean;

    constructor(responseId: string, surveyId: string, guestId: string, responses: SurveyComponent[], updatedAt: Date, submitted: boolean) {
        this.surveyId = surveyId;
        this.responseId = responseId;
        this.guestId = guestId;
        this.responses = responses;
        this.updatedAt = updatedAt;
        this.submitted = submitted;
    }

    toObject?() {
        return {
            surveyId: this.surveyId,
            responseId: this.responseId,
            guestId: this.guestId,
            responses: this.responses?.map(response => response.toObject ? response.toObject() : response),
            updatedAt: this.updatedAt,
            submitted: this.submitted
        };
    }
}