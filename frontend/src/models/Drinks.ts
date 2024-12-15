export class Drinks {

    willDrinkAlcohol?: Boolean;
    preferences: string;
    numberOfDrinks?: number;

    constructor(preferences: string, numberOfDrinks?: number, willDrinkAlcohol?: Boolean) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.numberOfDrinks = numberOfDrinks;
    }
}