package accommodation

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Accommodation)(nil)), func() interface{} {
		return new(Accommodation)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*AccommodationDTO)(nil)), func() interface{} {
		return new(AccommodationDTO)
	})
}
