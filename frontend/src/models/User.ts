import { WeddingRole } from "./WeddingRole";

export class User {

    id: string;
    email: string;
    phone: string;
    weddingRoles: Array<WeddingRole>;

    constructor(id: string, email: string, phone: string, weddingRoles: Array<WeddingRole>) {
        this.id = id;
        this.email = email;
        this.phone = phone;
        this.weddingRoles = weddingRoles;
    }
}