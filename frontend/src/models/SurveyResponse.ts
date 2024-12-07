import { Guest } from "./Guest";
import { Survey } from "./Survey";

export class SurveyResponse {

    responseId?: string;
    guest: Guest;
    survey: Survey;
    updatedAt: Date;
    submitted: boolean;

    constructor(guest: Guest, survey: Survey, updatedAt: Date, submitted: boolean, responseId?: string) {
        this.responseId = responseId;
        this.guest = guest;
        this.survey = survey;
        this.updatedAt = updatedAt;
        this.submitted = submitted;
    }

}