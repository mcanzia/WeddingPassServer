import { DrinkCount } from "@/models/DrinkCount";

export class Drinks {

    willDrinkAlcohol: boolean;
    preferences: Array<string>;
    drinkCount: Array<DrinkCount>;

    constructor(willDrinkAlcohol: boolean, preferences: Array<string>, drinkCount: Array<DrinkCount>) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.drinkCount = drinkCount;
    }
}