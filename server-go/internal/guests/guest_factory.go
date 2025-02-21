package guests

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Guest)(nil)), func() interface{} {
		return new(Guest)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*GuestDTO)(nil)), func() interface{} {
		return new(GuestDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*PendingGuest)(nil)), func() interface{} {
		return new(PendingGuest)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*PendingGuestDTO)(nil)), func() interface{} {
		return new(PendingGuestDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*UploadValidation)(nil)), func() interface{} {
		return new(UploadValidation)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*UploadValidationDTO)(nil)), func() interface{} {
		return new(UploadValidationDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*UploadGuestLists)(nil)), func() interface{} {
		return new(UploadGuestLists)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*UploadGuestListsDTO)(nil)), func() interface{} {
		return new(UploadGuestListsDTO)
	})
}
