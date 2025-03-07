import { Accommodation } from "./Accommodation";
import { Drinks } from "./Drinks";
import { Transportation } from "./Transportation";
import { SubEvent } from "./SubEvent";

export class Guest {

    id: string;
    eventId: string;
    groupNumber: Number;
    name: string;
    email: string;
    phone: string;
    subEvents: SubEvent[];
    attendingSubEvents?: SubEvent[];
    arrival?: Transportation;
    departure?: Transportation;
    drinks?: Drinks;
    serialNumber?: string;
    dietaryRestrictions?: string;
    accommodation?: Accommodation;

    constructor(id: string, eventId: string, name: string, email: string, phone: string, subEvents: SubEvent[], groupNumber: Number, attendingSubEvents: SubEvent[], arrival: Transportation, departure: Transportation, drinks?: Drinks, serialNumber?: string, dietaryRestrictions?: string, accommodation?: Accommodation) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.subEvents = subEvents;
        this.groupNumber = groupNumber;
        this.attendingSubEvents = attendingSubEvents;
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
            eventId: this.eventId,
            groupNumber: this.groupNumber,
            name: this.name,
            email: this.email,
            phone: this.phone,
            subEvents: this.subEvents.map(subEvent => subEvent.toObject ? subEvent.toObject() : subEvent),
            attendingSubEvents: this.attendingSubEvents?.map(attendingSubEvent => attendingSubEvent.toObject ? attendingSubEvent.toObject() : attendingSubEvent),
            arrival: this.arrival?.toObject ? this.arrival.toObject() : this.arrival,
            departure: this.departure?.toObject ? this.departure.toObject() : this.departure,
            drinks: this.drinks?.toObject ? this.drinks.toObject() : this.drinks,
            serialNumber: this.serialNumber,
            dietaryRestrictions: this.dietaryRestrictions,
            accommodation: this.accommodation?.toObject ? this.accommodation.toObject() : this.accommodation
        };
    }

}