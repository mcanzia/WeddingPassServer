import { Transportation } from "@/models/Transportation";

export class Bus extends Transportation {

    busTime: Date;
    busPickupPoint: string;

    constructor(type: string, busTime: Date, busPickupPoint: string) {
        super(type);
        this.busTime = busTime;
        this.busPickupPoint = busPickupPoint;
    }

}