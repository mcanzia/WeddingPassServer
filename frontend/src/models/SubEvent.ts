export class SubEvent {

    id: string;
    name: string;
    eventId: string;
    order: number;

    constructor(id: string, name: string, eventId: string, order: number) {
        this.id = id;
        this.name = name;
        this.eventId = eventId;
        this.order = order;
    }
}