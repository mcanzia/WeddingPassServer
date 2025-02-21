package users

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*User)(nil)), func() interface{} {
		return new(User)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*UserDTO)(nil)), func() interface{} {
		return new(UserDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*EventRole)(nil)), func() interface{} {
		return new(EventRole)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*EventRoleDTO)(nil)), func() interface{} {
		return new(EventRoleDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*InviteToken)(nil)), func() interface{} {
		return new(InviteToken)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*InviteTokenDTO)(nil)), func() interface{} {
		return new(InviteTokenDTO)
	})
}
