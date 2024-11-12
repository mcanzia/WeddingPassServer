import { SurveyComponent } from "./SurveyComponent";

export class SurveyTrigger {

    triggerField: string;
    child: SurveyComponent

    constructor(triggerField: string, child: SurveyComponent) {
        this.triggerField = triggerField;
        this.child = child;
    }

    toObject?() {
        return {
            triggerField: this.triggerField,
            child: this.child.toObject ? this.child.toObject() : this.child,
        };
    }
}