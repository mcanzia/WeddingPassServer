import { Transportation } from "@/models/Transportation";

export class Flight extends Transportation {

    flightNumber: string;
    flightTime: string;

    constructor(type: string, flightNumber: string, flightTime: string) {
        super(type);
        this.flightNumber = flightNumber;
        this.flightTime = flightTime;
    }

}