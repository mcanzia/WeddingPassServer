
export class InviteToken {

    token: string

    constructor(token: string) {
        this.token = token;
    }

    toObject?() {
        return {
            token: this.token
        };
    }

}