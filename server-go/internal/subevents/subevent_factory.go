package subevents

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*SubEvent)(nil)), func() interface{} {
		return new(SubEvent)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SubEventDTO)(nil)), func() interface{} {
		return new(SubEventDTO)
	})
}
