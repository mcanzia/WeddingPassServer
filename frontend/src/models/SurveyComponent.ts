export class SurveyComponent {

    label?: string;
    type: string;
    friendlyName: string;
    value?: Array<string> | string;
    options?: Array<string>;

    constructor(type: string, friendlyName: string, options?: Array<string>, label?: string, value?: Array<string> | string) {
        this.label = label;
        this.type = type;
        this.options = options;
        this.friendlyName = friendlyName;
        this.value = value;
    }
}