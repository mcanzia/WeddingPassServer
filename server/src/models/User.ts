import { Roles } from "./Roles";
import { EventRole } from "./EventRole";

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

    toObject?() {
        return {
            id: this.id,
            email: this.email,
            phone: this.phone,
            eventRoles: this.eventRoles.map(role => role.toObject ? role.toObject() : role),
        };
    }

}