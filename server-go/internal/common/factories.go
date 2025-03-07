package common

import (
	"fmt"
	"reflect"
)

type NewInstanceFunc func() interface{}

var instanceFactories = make(map[reflect.Type]NewInstanceFunc)

func RegisterInstanceFactory(t reflect.Type, fn NewInstanceFunc) {
	instanceFactories[t] = fn
}

func GetNewInstance(t reflect.Type) (interface{}, error) {
	factory, ok := instanceFactories[t]
	if !ok {
		return nil, fmt.Errorf("no factory registered for type %v", t)
	}
	return factory(), nil
}
