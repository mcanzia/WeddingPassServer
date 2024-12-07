import { Transportation } from "./Transportation";

export class Flight extends Transportation {

    flightNumber?: string;
    flightTime?: Date;

    constructor(type?: string, flightNumber?: string, flightTime?: Date) {
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