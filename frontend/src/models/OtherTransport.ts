import { Transportation } from "@/models/Transportation";

export class OtherTransport extends Transportation {

    time: string;

    constructor(type: string, time: string) {
        super(type);
        this.time = time;
    }

}