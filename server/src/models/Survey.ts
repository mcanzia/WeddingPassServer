import { SurveyComponent } from "./SurveyComponent";

export class Survey {

    id: string;
    weddingId: string;
    title: string;
    surveyComponents: SurveyComponent[]

    constructor(id: string, weddingId: string, title: string, surveyComponents: SurveyComponent[]) {
        this.id = id;
        this.weddingId = weddingId;
        this.title = title;
        this.surveyComponents = surveyComponents;
    }

    toObject?() {
        return {
            id: this.id,
            weddingId: this.weddingId,
            title: this.title,
            surveyComponents: this.surveyComponents?.map(surveyComponent => surveyComponent.toObject ? surveyComponent.toObject() : surveyComponent)
        };
    }
}