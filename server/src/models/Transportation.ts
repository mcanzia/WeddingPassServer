
export class Transportation {

    type?: string;

    constructor(type?: string) {
        this.type = type;
    }

    toObject?() {
        return {
            type: this.type
        }
    }
}