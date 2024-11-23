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

}