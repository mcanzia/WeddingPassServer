import { SurveyTrigger } from "./SurveyTrigger";

export class SurveyComponent {

    id?: string;
    label?: string;
    type: string;
    friendlyName: string;
    surveyTriggers?: Array<SurveyTrigger>
    order?: number;
    componentValue?: any;
    options?: Array<string>;
    editableInfo?: Boolean;
    infoLookupField?: string;

    constructor(type: string, friendlyName: string, editableInfo?: Boolean, surveyTriggers?: Array<SurveyTrigger>, order?: number, id?: string, options?: Array<string>, label?: string, componentValue?: any, infoLookupField?: string) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.order = order;
        this.options = options;
        this.friendlyName = friendlyName;
        this.componentValue = componentValue;
        this.surveyTriggers = surveyTriggers;
        this.editableInfo = editableInfo;
        this.infoLookupField = infoLookupField;
    }
}