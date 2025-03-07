import { DrinkCount } from "./DrinkCount";

export class Drinks {

    willDrinkAlcohol: boolean;
    preferences: Array<string>;
    drinkCount: Array<DrinkCount>;

    constructor(willDrinkAlcohol: boolean, preferences: Array<string>, drinkCount: Array<DrinkCount>) {
        this.willDrinkAlcohol = willDrinkAlcohol;
        this.preferences = preferences;
        this.drinkCount = drinkCount;
    }

    toObject?() {
        return {
            willDrinkAlcohol: this.willDrinkAlcohol,
            preferences: this.preferences,
            drinkCount: this.drinkCount.map(dc => dc.toObject ? dc.toObject() : dc)
        };
    }
}