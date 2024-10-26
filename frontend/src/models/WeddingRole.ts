import { Wedding } from "./Wedding";

export class WeddingRole {
    
    role: string;
    wedding: Wedding;

    constructor (role: string, wedding: Wedding){
        this.role = role;
        this.wedding = wedding;
    }
}