import { EventRole } from "./EventRole";

export class InviteToken {

    token: string
    eventRole?: EventRole

    constructor(token: string, eventRole?: EventRole) {
        this.token = token;
        this.eventRole = eventRole;
    }

    toObject?() {
        return {
            token: this.token,
            eventRole: this.eventRole
        };
    }

}