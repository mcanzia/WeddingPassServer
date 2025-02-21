import { SurveyComponent } from "./SurveyComponent";

export class Survey {

    id?: string;
    eventId?: string;
    title: string;
    surveyComponents: SurveyComponent[];
    published: boolean;
    showPartyMemberSurveys: boolean;

    constructor(id: string, eventId: string, title: string, surveyComponents: SurveyComponent[], published: boolean, showPartyMemberSurveys: boolean) {
        this.id = id;
        this.eventId = eventId;
        this.title = title;
        this.surveyComponents = surveyComponents;
        this.published = published;
        this.showPartyMemberSurveys = showPartyMemberSurveys;
    }
}