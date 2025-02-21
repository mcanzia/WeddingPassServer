export class Hotel {

    id: string;
    eventId: string;
    name: string;
    location: string;

    constructor(id: string, eventId: string, name: string, location: string) {
        this.id = id;
        this.eventId = eventId;
        this.name = name;
        this.location = location;
    }
}