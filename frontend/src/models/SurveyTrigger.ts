import { SurveyComponent } from "./SurveyComponent";

export class SurveyTrigger {

    triggerField: string;
    child: SurveyComponent

    constructor(triggerField: string, child: SurveyComponent) {
        this.triggerField = triggerField;
        this.child = child;
    }
}