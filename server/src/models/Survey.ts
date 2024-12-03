import { SurveyComponent } from "./SurveyComponent";

export class Survey {

    id: string;
    weddingId: string;
    title: string;
    surveyComponents: SurveyComponent[];
    published: boolean;
    showPartyMemberSurveys: boolean;

    constructor(id: string, weddingId: string, title: string, surveyComponents: SurveyComponent[], published: boolean, showPartyMemberSurveys: boolean) {
        this.id = id;
        this.weddingId = weddingId;
        this.title = title;
        this.surveyComponents = surveyComponents;
        this.published = published;
        this.showPartyMemberSurveys = showPartyMemberSurveys;
    }

    toObject?() {
        return {
            id: this.id,
            weddingId: this.weddingId,
            title: this.title,
            surveyComponents: this.surveyComponents?.map(surveyComponent => surveyComponent.toObject ? surveyComponent.toObject() : surveyComponent),
            published: this.published,
            showPartyMemberSurveys: this.showPartyMemberSurveys
        };
    }
}