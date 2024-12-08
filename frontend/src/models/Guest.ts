import { WeddingEvent } from "@/models/WeddingEvent";
import { Transportation } from "@/models/Transportation";
import { Drinks } from "@/models/Drinks";
import { Accommodation } from "@/models/Accommodation";

export class Guest {

    id?: string;
    weddingId: string;
    groupNumber: Number;
    name: string;
    email: string;
    phone: string;
    events: WeddingEvent[];
    attendingEvents?: WeddingEvent[];
    arrival?: Transportation;
    departure?: Transportation;
    drinks?: Drinks;
    serialNumber?: string;
    dietaryRestrictions?: string;
    accommodation?: Accommodation;

    constructor(id: string, weddingId: string, name: string, email: string, phone: string, events: WeddingEvent[], groupNumber: Number, attendingEvents: WeddingEvent[], arrival: Transportation, departure: Transportation, drinks?: Drinks, serialNumber?: string, dietaryRestrictions?: string, accommodation?: Accommodation) {
        this.id = id;
        this.weddingId = weddingId;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.events = events;
        this.groupNumber = groupNumber;
        this.attendingEvents = attendingEvents;
        this.arrival = arrival;
        this.departure = departure;
        this.drinks = drinks;
        this.serialNumber = serialNumber;
        this.dietaryRestrictions = dietaryRestrictions;
        this.accommodation = accommodation;
    }

    static detailKeys = ['name', 'email', 'phone', 'events', 'attendingEvents', 'arrival:type', 'arrival:flightTime', 'arrival:flightNumber', 'arrival:trainTime', 'arrival:trainNumber', 'departure:type', 'departure:flightTime', 'departure:flightNumber', 'departure:trainTime', 'departure:trainNumber', 'drinks:willDrinkAlcohol', 'drinks:preferences', 'dietaryRestrictions', 'accommodation:roomNumber', 'accommodation:hotel:name'] as const;
}