import { Transportation } from "./Transportation";

export class Bus extends Transportation {

    busTime?: string;
    busPickupPoint?: string;

    constructor(type?: string, busTime?: string, busPickupPoint?: string) {
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