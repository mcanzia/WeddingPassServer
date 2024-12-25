export class CustomNotification {

    message: string;
    type: string;
    title?: string;
    variant?: string;

    constructor(message: string, type: string, title?: string, variant?: string) {
        this.message = message;
        this.type = type;
        this.title = title;
        this.variant = variant;
    }
}