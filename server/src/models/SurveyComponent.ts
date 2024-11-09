export class SurveyComponent {

    id: string;
    label: string;
    type: string;
    friendlyName: string;
    value: any;
    options: Array<string>;

    constructor(id: string, label: string, type: string, friendlyName: string,  value: any, options: Array<string>, ) {
        this.id = id;
        this.label = label;
        this.type = type;
        this.friendlyName = friendlyName;
        this.value = value;
        this.options = options;
    }

    toObject?() {
        return {
            id: this.id,
            label: this.label,
            type: this.type,
            friendlyName: this.friendlyName,
            value: this.value,
            options: this.options
        };
    }
}