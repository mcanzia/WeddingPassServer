package events

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Event)(nil)), func() interface{} {
		return new(Event)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*EventDTO)(nil)), func() interface{} {
		return new(EventDTO)
	})
}
