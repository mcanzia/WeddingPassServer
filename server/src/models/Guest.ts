import { Drinks } from "./Drinks";
import { Transportation } from "./Transportation";
import { WeddingEvent } from "./WeddingEvent";

export class Guest {

    id: string;
    weddingId: string;
    name: string;
    email: string;
    phone: string;
    events: Array<WeddingEvent>;
    attendingEvents?: Array<WeddingEvent>;
    arrival?: Transportation;
    departure?: Transportation;
    drinks?: Drinks

    constructor(id: string, weddingId: string, name: string, email: string, phone: string, events: Array<WeddingEvent>, attendingEvents: Array<WeddingEvent>, arrival?: Transportation, departure?: Transportation, drinks?: Drinks) {
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

    toObject?() {
        return {
            id: this.id,
            weddingId: this.weddingId,
            name: this.name,
            email: this.email,
            phone: this.phone,
            events: this.events.map(event => event.toObject ? event.toObject() : event),
            attendingEvents: this.attendingEvents?.map(event => event.toObject ? event.toObject() : event),
            arrival: this.arrival?.toObject ? this.arrival.toObject() : this.arrival,
            departure: this.departure?.toObject ? this.departure.toObject() : this.departure,
            drinks: this.drinks?.toObject ? this.drinks.toObject() : this.drinks
        };
    }

}