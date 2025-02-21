package passes

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Pass)(nil)), func() interface{} {
		return new(Pass)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*PassDTO)(nil)), func() interface{} {
		return new(PassDTO)
	})
}
