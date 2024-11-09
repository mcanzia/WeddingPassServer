import { WeddingEvent } from "@/models/WeddingEvent";

export class Guest {
    
    id?: string;
    weddingId: string;
    name: string;
    email: string;
    phone: string;
    events: WeddingEvent[];
    attendingEvents?: WeddingEvent[];

    constructor (id: string, weddingId: string, name: string, email: string, phone: string, events: WeddingEvent[], attendingEvents: WeddingEvent[]){
        this.id = id;
        this.weddingId = weddingId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.events = events;
        this.attendingEvents = attendingEvents;
    }

    static detailKeys = ['name', 'email', 'phone', 'events', 'attendingEvents'] as const;
}