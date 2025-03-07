import { Event } from "./Event";

export class EventRole {

    role: string;
    event: Event;
    guestId?: string;

    constructor(role: string, event: Event, guestId?: string) {
        this.role = role;
        this.event = event;
        this.guestId = guestId;
    }

    toObject?() {
        return {
            role: this.role,
            event: this.event.toObject ? this.event.toObject() : this.event,
            guestId: this.guestId,
        };
    }
}