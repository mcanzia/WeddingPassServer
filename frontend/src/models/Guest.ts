import { WeddingEvent } from "@/models/WeddingEvent";
import { Transportation } from "@/models/Transportation";
import { Drinks } from "@/models/Drinks";

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

    constructor(id: string, weddingId: string, name: string, email: string, phone: string, events: WeddingEvent[], groupNumber: Number, attendingEvents: WeddingEvent[], arrival: Transportation, departure: Transportation, drinks?: Drinks, serialNumber?: string, dietaryRestrictions?: string) {
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
    }

    static detailKeys = ['name', 'email', 'phone', 'events', 'attendingEvents', 'arrival:type', 'arrival:flightTime', 'arrival:trainTime', 'departure:type', 'departure:flightTime', 'departure:trainTime', 'drinks:willDrinkAlcohol', 'drinks:preferences', 'dietaryRestrictions'] as const;
}