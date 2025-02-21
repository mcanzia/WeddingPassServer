package drinks

import (
	"weddingpass/server/internal/subevents"
)

type Drinks struct {
	WillDrinkAlcohol bool         `json:"willDrinkAlcohol"`
	Preferences      []string     `json:"preferences"`
	DrinkCount       []DrinkCount `json:"drinkCount"`
}

func NewDrinksInstance() *Drinks {
	return &Drinks{}
}

type DrinksDTO struct {
	WillDrinkAlcohol bool            `json:"willDrinkAlcohol"`
	Preferences      []string        `json:"preferences"`
	DrinkCount       []DrinkCountDTO `json:"drinkCount"`
}

func NewDrinksDTOInstance() *DrinksDTO {
	return &DrinksDTO{}
}

type DrinkCount struct {
	NumberOfDrinks int                `json:"numberOfDrinks"`
	SubEvent       subevents.SubEvent `json:"subEvent"`
}

func NewDrinkCountInstance() *DrinkCount {
	return &DrinkCount{}
}

type DrinkCountDTO struct {
	NumberOfDrinks int                   `json:"numberOfDrinks"`
	SubEvent       subevents.SubEventDTO `json:"subEvent"`
}

func NewDrinkCountDTOInstance() *DrinkCountDTO {
	return &DrinkCountDTO{}
}
