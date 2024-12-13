import { Transportation } from "./Transportation";

export class OtherTransport extends Transportation {

    time?: string;

    constructor(type: string, time?: string) {
        super(type);
        this.time = time;
    }

    toObject?() {
        return {
            type: this.type,
            time: this.time
        };
    }

}