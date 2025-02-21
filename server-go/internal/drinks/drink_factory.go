package drinks

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Drinks)(nil)), func() interface{} {
		return new(Drinks)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*DrinksDTO)(nil)), func() interface{} {
		return new(DrinksDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*DrinkCount)(nil)), func() interface{} {
		return new(DrinkCount)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*DrinkCountDTO)(nil)), func() interface{} {
		return new(DrinkCountDTO)
	})
}
