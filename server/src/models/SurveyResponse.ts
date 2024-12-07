import { Guest } from "./Guest";
import { Survey } from "./Survey";
import { SurveyComponent } from "./SurveyComponent";

export class SurveyResponse {

    responseId: string;
    guest: Guest;
    survey: Survey;
    updatedAt: Date;
    submitted: boolean;

    constructor(responseId: string, guest: Guest, survey: Survey, updatedAt: Date, submitted: boolean) {
        this.responseId = responseId;
        this.guest = guest;
        this.survey = survey;
        this.updatedAt = updatedAt;
        this.submitted = submitted;
    }

    toObject?() {
        return {
            responseId: this.responseId,
            guest: this.guest.toObject ? this.guest.toObject() : this.guest,
            survey: this.survey.toObject ? this.survey.toObject() : this.survey,
            updatedAt: this.updatedAt,
            submitted: this.submitted
        };
    }
}