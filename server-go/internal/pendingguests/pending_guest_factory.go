package pendingguests

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*PendingGuest)(nil)), func() interface{} {
		return new(PendingGuest)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*PendingGuestDTO)(nil)), func() interface{} {
		return new(PendingGuestDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*GuestLink)(nil)), func() interface{} {
		return new(GuestLink)
	})
}
