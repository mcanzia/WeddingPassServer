import { Roles } from "./Roles";
import { WeddingRole } from "./WeddingRole";

export class User {

    id: string;
    email: string;
    weddingRoles: Array<WeddingRole>

    constructor(id: string, email: string, weddingRoles: Array<WeddingRole>) {
        this.id = id;
        this.email = email;
        this.weddingRoles = weddingRoles;
    }

    toObject?() {
        return {
            id: this.id,
            email: this.email,
            weddingRoles: this.weddingRoles.map(role => role.toObject ? role.toObject() : role),
        };
    }

}