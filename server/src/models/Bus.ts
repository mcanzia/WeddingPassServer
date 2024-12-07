import { Transportation } from "./Transportation";

export class Bus extends Transportation {

    busTime?: Date;
    busPickupPoint?: string;

    constructor(type?: string, busTime?: Date, busPickupPoint?: string) {
        super(type);
        this.busTime = busTime;
        this.busPickupPoint = busPickupPoint;
    }

    toObject?() {
        return {
            type: this.type,
            busTime: this.busTime,
            busPickupPoint: this.busPickupPoint
        };
    }
}