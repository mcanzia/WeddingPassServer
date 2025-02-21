package drinks

import (
	"fmt"
	"weddingpass/server/internal/subevents"
)

type DrinksConverter struct {
	SubEventConverter *subevents.SubEventConverter
}

func NewDrinksConverter(subEventConverter *subevents.SubEventConverter) *DrinksConverter {
	return &DrinksConverter{
		SubEventConverter: subEventConverter,
	}
}

func (dc *DrinksConverter) ConvertDrinksToDAO(drinks *DrinksDTO) (*Drinks, error) {
	var drinkCounts []DrinkCount
	for _, drinkCountDto := range drinks.DrinkCount {
		drinkCount, err := dc.ConvertDrinkCountToDAO(&drinkCountDto)
		if err != nil {
			return nil, err
		}
		drinkCounts = append(drinkCounts, *drinkCount)
	}
	dao := &Drinks{
		WillDrinkAlcohol: drinks.WillDrinkAlcohol,
		Preferences:      drinks.Preferences,
		DrinkCount:       drinkCounts,
	}

	return dao, nil
}

func (dc *DrinksConverter) ConvertDrinksToDTO(rawDrinks *Drinks) (*DrinksDTO, error) {
	var drinkCountDtos []DrinkCountDTO
	for _, drinkCount := range rawDrinks.DrinkCount {
		drinkCountDto, err := dc.ConvertDrinkCountToDTO(&drinkCount)
		if err != nil {
			return nil, err
		}
		drinkCountDtos = append(drinkCountDtos, *drinkCountDto)
	}
	dto := &DrinksDTO{
		WillDrinkAlcohol: rawDrinks.WillDrinkAlcohol,
		Preferences:      rawDrinks.Preferences,
		DrinkCount:       drinkCountDtos,
	}

	return dto, nil
}

func (dc *DrinksConverter) ConvertDrinkCountToDAO(drinkCount *DrinkCountDTO) (*DrinkCount, error) {
	subEvent, err := dc.SubEventConverter.ConvertSubEventToDAO(&drinkCount.SubEvent)
	if err != nil {
		return nil, fmt.Errorf("failed to convert drink count to dto: %w", err)
	}
	dao := &DrinkCount{
		NumberOfDrinks: drinkCount.NumberOfDrinks,
		SubEvent:       *subEvent,
	}

	return dao, nil
}

func (dc *DrinksConverter) ConvertDrinkCountToDTO(rawDrinkCount *DrinkCount) (*DrinkCountDTO, error) {
	subEventDTO, err := dc.SubEventConverter.ConvertSubEventToDTO(&rawDrinkCount.SubEvent)
	if err != nil {
		return nil, fmt.Errorf("failed to convert drink count to dto: %w", err)
	}
	dto := &DrinkCountDTO{
		NumberOfDrinks: rawDrinkCount.NumberOfDrinks,
		SubEvent:       *subEventDTO,
	}

	return dto, nil
}
