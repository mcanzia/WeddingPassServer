export class Drinks {

    preferences: Array<string>;
    numberOfDrinks: Number;

    constructor(preferences: Array<string>, numberOfDrinks: Number) {
        this.preferences = preferences;
        this.numberOfDrinks = numberOfDrinks;
    }
}