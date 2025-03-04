import { TransportationType } from "@/models/TransportationType";

export class Transportation {

    type: TransportationType;
    isArrival: boolean;
    time: string;
    number: string;

    constructor(type: TransportationType, isArrival: boolean, time: string, number: string) {
        this.type = type;
        this.isArrival = isArrival;
        this.time = time;
        this.number = number;
    }
}