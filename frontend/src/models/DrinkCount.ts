import { SubEvent } from "@/models/SubEvent";

export class DrinkCount {

    numberOfDrinks: number;
    subEvent: SubEvent

    constructor(numberOfDrinks: number, subEvent: SubEvent) {
        this.numberOfDrinks = numberOfDrinks;
        this.subEvent = subEvent;
    }

    toObject?() {
        return {
            numberOfDrinks: this.numberOfDrinks,
            subEvent: this.subEvent
        };
    }
}