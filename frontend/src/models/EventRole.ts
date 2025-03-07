import { Event } from "@/models/Event";
export class EventRole {

    role: string;
    event: Event;
    guestId?: string;

    constructor(role: string, event: Event, guestId?: string) {
        this.role = role;
        this.event = event;
        this.guestId = guestId;
    }
}