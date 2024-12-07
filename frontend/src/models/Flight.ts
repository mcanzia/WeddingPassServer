import { Transportation } from "@/models/Transportation";

export class Flight extends Transportation {

    flightNumber: string;
    flightTime: Date;

    constructor(type: string, flightNumber: string, flightTime: Date) {
        super(type);
        this.flightNumber = flightNumber;
        this.flightTime = flightTime;
    }

}