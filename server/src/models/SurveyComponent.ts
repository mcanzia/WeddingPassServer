import { SurveyTrigger } from "./SurveyTrigger";

export class SurveyComponent {

    id: string;
    label: string;
    type: string;
    friendlyName: string;
    order: number;
    componentValue: any;
    options: Array<string>;
    surveyTriggers: Array<SurveyTrigger>
    editableInfo: Boolean;
    infoLookupField: string;

    constructor(id: string, label: string, type: string, friendlyName: string, order: number, componentValue: any, options: Array<string>, surveyTriggers: Array<SurveyTrigger>, editableInfo: Boolean, infoLookupField: string) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.friendlyName = friendlyName;
        this.order = order;
        this.componentValue = componentValue;
        this.options = options;
        this.surveyTriggers = surveyTriggers;
        this.editableInfo = editableInfo;
        this.infoLookupField = infoLookupField;
    }

    toObject?() {
        return {
            id: this.id,
            label: this.label,
            type: this.type,
            friendlyName: this.friendlyName,
            order: this.order,
            componentValue: this.componentValue,
            options: this.options,
            surveyTriggers: this.surveyTriggers,
            editableInfo: this.editableInfo,
            infoLookupField: this.infoLookupField
        };
    }
}