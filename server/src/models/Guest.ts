import { WeddingEvent } from "./WeddingEvent";

export class Guest {

    id: string;
    weddingId: string;
    serialNumber?: string;
    name: string;
    email: string;
    phone: string;
    events: Array<WeddingEvent>;
    attendingEvents?: Array<WeddingEvent>;

    constructor(id: string, weddingId: string, serialNumber: string, name: string, email: string, phone: string, events: Array<WeddingEvent>, attendingEvents: Array<WeddingEvent>) {
        this.id = id;
        this.weddingId = weddingId;
        this.name = name;
        this.serialNumber = serialNumber;
        this.email = email;
        this.phone = phone;
        this.events = events;
        this.attendingEvents = attendingEvents;
    }

    toObject?() {
        return {
            id: this.id,
            weddingId: this.weddingId,
            name: this.name,
            serialNumber: this.serialNumber,
            email: this.email,
            phone: this.phone,
            events: this.events.map(event => event.toObject ? event.toObject() : event),
            attendingEvents: this.attendingEvents?.map(event => event.toObject ? event.toObject() : event)
        };
    }

}