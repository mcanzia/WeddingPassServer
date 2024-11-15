export class Drinks {

    preferences: Array<string>;
    numberOfDrinks: Number;

    constructor(preferences: Array<string>, numberOfDrinks: Number) {
        this.preferences = preferences;
        this.numberOfDrinks = numberOfDrinks;
    }

    toObject?() {
        return {
            preferences: this.preferences,
            numberOfDrinks: this.numberOfDrinks
        };
    }
}