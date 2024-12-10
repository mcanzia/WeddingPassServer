import { WeddingRole } from "./WeddingRole";

export class InviteToken {

    token: string
    weddingRole?: WeddingRole

    constructor(token: string, weddingRole?: WeddingRole) {
        this.token = token;
        this.weddingRole = weddingRole;
    }

    toObject?() {
        return {
            token: this.token,
            weddingRole: this.weddingRole
        };
    }

}