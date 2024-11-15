import { Transportation } from "@/models/Transportation";

export class Bus extends Transportation {

    busTime: string;
    busPickupPoint: string;

    constructor(type: string, busTime: string, busPickupPoint: string) {
        super(type);
        this.busTime = busTime;
        this.busPickupPoint = busPickupPoint;
    }

}