import { DrinkCount } from "./DrinkCount";

export class Drinks {

    willDrinkAlcohol: boolean;
    preferences: string;
    drinkCount: Array<DrinkCount>;

    constructor(willDrinkAlcohol: boolean, preferences: string, drinkCount: Array<DrinkCount>) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.drinkCount = drinkCount;
    }

    toObject?() {
        return {
            willDrinkAlcohol: this.willDrinkAlcohol,
            preferences: this.preferences,
            drinkCount: this.drinkCount
        };
    }
}