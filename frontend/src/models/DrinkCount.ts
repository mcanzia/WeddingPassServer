import { WeddingEvent } from "@/models/WeddingEvent";

export class DrinkCount {

    numberOfDrinks: number;
    event: WeddingEvent

    constructor(numberOfDrinks: number, event: WeddingEvent) {
        this.numberOfDrinks = numberOfDrinks;
        this.event = event;
    }

    toObject?() {
        return {
            numberOfDrinks: this.numberOfDrinks,
            event: this.event
        };
    }
}