import { SubEvent } from "@/models/SubEvent";
import { Transportation } from "@/models/Transportation";
import { Drinks } from "@/models/Drinks";
import { Accommodation } from "@/models/Accommodation";

export class Guest {

    id?: string;
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

    static detailKeys = ['name', 'email', 'phone', 'subEvents', 'attendingSubEvents', 'arrival:type', 'arrival:time', 'arrival:flightTime', 'arrival:flightNumber', 'arrival:trainTime', 'arrival:trainNumber', 'departure:type', 'departure:time', 'departure:flightTime', 'departure:flightNumber', 'departure:trainTime', 'departure:trainNumber', 'drinks:willDrinkAlcohol', 'drinks:preferences', 'dietaryRestrictions', 'accommodation:roomNumber', 'accommodation:hotel:name'] as const;
}