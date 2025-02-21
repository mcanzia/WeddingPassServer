package transportation

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Transportation)(nil)), func() interface{} {
		return new(Transportation)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*TransportationDTO)(nil)), func() interface{} {
		return new(TransportationDTO)
	})
}
