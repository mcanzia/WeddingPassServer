import { Transportation } from "./Transportation";

export class Flight extends Transportation {

    flightNumber?: string;
    flightTime?: string;

    constructor(type?: string, flightNumber?: string, flightTime?: string) {
        super(type);
        this.flightNumber = flightNumber;
        this.flightTime = flightTime;
    }

    toObject?() {
        return {
            type: this.type,
            flightNumber: this.flightNumber,
            flightTime: this.flightTime
        };
    }
}