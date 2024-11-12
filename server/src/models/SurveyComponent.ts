import { SurveyTrigger } from "./SurveyTrigger";

export class SurveyComponent {

    id: string;
    label: string;
    type: string;
    friendlyName: string;
    order: number;
    value: any;
    options: Array<string>;
    surveyTriggers: Array<SurveyTrigger>
    editableInfo: Boolean;
    infoLookupField: string;

    constructor(id: string, label: string, type: string, friendlyName: string, order: number, value: any, options: Array<string>, surveyTriggers: Array<SurveyTrigger>, editableInfo: Boolean, infoLookupField: string ) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.friendlyName = friendlyName;
        this.order = order;
        this.value = value;
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
            value: this.value,
            options: this.options,
            surveyTriggers: this.surveyTriggers,
            editableInfo: this.editableInfo,
            infoLookupField: this.infoLookupField
        };
    }
}