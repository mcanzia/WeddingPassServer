package accommodation

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*BaseAccommodation)(nil)), func() interface{} {
		return new(BaseAccommodation)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*BaseAccommodationDTO)(nil)), func() interface{} {
		return new(BaseAccommodationDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*Hotel)(nil)), func() interface{} {
		return new(Hotel)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*HotelDTO)(nil)), func() interface{} {
		return new(HotelDTO)
	})
}
