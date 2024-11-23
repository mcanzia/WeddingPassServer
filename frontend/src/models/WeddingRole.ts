import { Wedding } from "./Wedding";

export class WeddingRole {

    role: string;
    wedding: Wedding;
    guestId?: string;

    constructor(role: string, wedding: Wedding, guestId?: string) {
        this.role = role;
        this.wedding = wedding;
        this.guestId = guestId;
    }
}