export class SurveyComponent {

    id?: string;
    label?: string;
    type: string;
    friendlyName: string;
    order?: number;
    value?: any;
    options?: Array<string>;

    constructor(type: string, friendlyName: string, order?: number, id?: string, options?: Array<string>, label?: string, value?: any) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.order = order;
        this.options = options;
        this.friendlyName = friendlyName;
        this.value = value;
    }
}