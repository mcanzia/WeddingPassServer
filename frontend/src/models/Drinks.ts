export class Drinks {

    willDrinkAlcohol: boolean;
    preferences: Array<string>;
    numberOfDrinks: Number;

    constructor(willDrinkAlcohol: boolean, preferences: Array<string>, numberOfDrinks: Number) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.numberOfDrinks = numberOfDrinks;
    }
}