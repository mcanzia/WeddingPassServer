export class Drinks {

    willDrinkAlcohol?: Boolean;
    preferences: string;
    numberOfDrinks?: Number;

    constructor(preferences: string, numberOfDrinks?: Number, willDrinkAlcohol?: Boolean) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.numberOfDrinks = numberOfDrinks;
    }
}