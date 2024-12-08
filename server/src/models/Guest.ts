import { Accommodation } from "./Accommodation";
import { Drinks } from "./Drinks";
import { Transportation } from "./Transportation";
import { WeddingEvent } from "./WeddingEvent";

export class Guest {

    id: string;
    weddingId: string;
    groupNumber: Number;
    name: string;
    email: string;
    phone: string;
    events: Array<WeddingEvent>;
    attendingEvents?: Array<WeddingEvent>;
    arrival?: Transportation;
    departure?: Transportation;
    drinks?: Drinks;
    serialNumber?: string;
    dietaryRestrictions?: string;
    accommodation?: Accommodation;

    constructor(id: string, weddingId: string, groupNumber: Number, name: string, email: string, phone: string, events: Array<WeddingEvent>, attendingEvents: Array<WeddingEvent>, arrival?: Transportation, departure?: Transportation, drinks?: Drinks, serialNumber?: string, dietaryRestrictions?: string, accommodation?: Accommodation) {
        this.id = id;
        this.weddingId = weddingId;
        this.groupNumber = groupNumber;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.events = events;
        this.attendingEvents = attendingEvents;
        this.arrival = arrival;
        this.departure = departure;
        this.drinks = drinks;
        this.serialNumber = serialNumber;
        this.dietaryRestrictions = dietaryRestrictions;
        this.accommodation = accommodation;
    }

    toObject?() {
        return {
            id: this.id,
            weddingId: this.weddingId,
            groupNumber: this.groupNumber,
            name: this.name,
            email: this.email,
            phone: this.phone,
            events: this.events.map(event => event.toObject ? event.toObject() : event),
            attendingEvents: this.attendingEvents?.map(event => event.toObject ? event.toObject() : event),
            arrival: this.arrival?.toObject ? this.arrival.toObject() : this.arrival,
            departure: this.departure?.toObject ? this.departure.toObject() : this.departure,
            drinks: this.drinks?.toObject ? this.drinks.toObject() : this.drinks,
            serialNumber: this.serialNumber,
            dietaryRestrictions: this.dietaryRestrictions,
            accommodation: this.accommodation?.toObject ? this.accommodation.toObject() : this.accommodation
        };
    }

}