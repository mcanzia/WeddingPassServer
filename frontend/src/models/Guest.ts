import { WeddingEvent } from "@/models/WeddingEvent";
import { Transportation } from "@/models/Transportation";
import { Drinks } from "@/models/Drinks";

export class Guest {
    
    id?: string;
    weddingId: string;
    name: string;
    email: string;
    phone: string;
    events: WeddingEvent[];
    attendingEvents?: WeddingEvent[];
    arrival?: Transportation;
    departure?: Transportation;
    drinks?: Drinks

    constructor (id: string, weddingId: string, name: string, email: string, phone: string, events: WeddingEvent[], attendingEvents: WeddingEvent[], arrival: Transportation, departure: Transportation, drinks?: Drinks){
        this.id = id;
        this.weddingId = weddingId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.events = events;
        this.attendingEvents = attendingEvents;
        this.arrival = arrival;
        this.departure = departure;
        this.drinks = drinks;
    }

    static detailKeys = ['name', 'email', 'phone', 'events', 'attendingEvents'] as const;
}