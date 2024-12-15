export class Drinks {

    willDrinkAlcohol: boolean;
    preferences: string;
    numberOfDrinks: number;

    constructor(willDrinkAlcohol: boolean, preferences: string, numberOfDrinks: number) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.numberOfDrinks = numberOfDrinks;
    }

    toObject?() {
        return {
            willDrinkAlcohol: this.willDrinkAlcohol,
            preferences: this.preferences,
            numberOfDrinks: this.numberOfDrinks
        };
    }
}