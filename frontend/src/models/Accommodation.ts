import { AccommodationType } from "@/models/AccommodationType";

export class Accommodation {

    id: string;
    eventId: string;
    type: AccommodationType;
    name: string;
    roomNumber: string;
    location: string;

    constructor(id: string, eventId: string, type: AccommodationType, name: string, roomNumber: string, location: string) {
        this.id = id;
        this.eventId = eventId;
        this.type = type;
        this.name = name;
        this.roomNumber = roomNumber;
        this.location = location;
    }
}