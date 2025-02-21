import { EventRole } from "@/models/EventRole";

export class User {

    id: string;
    email: string;
    phone: string;
    eventRoles: Array<EventRole>;

    constructor(id: string, email: string, phone: string, eventRoles: Array<EventRole>) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.eventRoles = eventRoles;
    }
}