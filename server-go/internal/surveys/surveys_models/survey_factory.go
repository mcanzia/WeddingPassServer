package surveys_models

import (
	"reflect"
	"weddingpass/server/internal/common"
)

// Registering factory creation functions for each of the models
func init() {
	common.RegisterInstanceFactory(reflect.TypeOf((*Survey)(nil)), func() interface{} {
		return new(Survey)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyDTO)(nil)), func() interface{} {
		return new(SurveyDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyComponent)(nil)), func() interface{} {
		return new(SurveyComponent)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyComponentDTO)(nil)), func() interface{} {
		return new(SurveyComponentDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyTrigger)(nil)), func() interface{} {
		return new(SurveyTrigger)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyTriggerDTO)(nil)), func() interface{} {
		return new(SurveyTriggerDTO)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyResponse)(nil)), func() interface{} {
		return new(SurveyResponse)
	})
	common.RegisterInstanceFactory(reflect.TypeOf((*SurveyResponseDTO)(nil)), func() interface{} {
		return new(SurveyResponseDTO)
	})
}
