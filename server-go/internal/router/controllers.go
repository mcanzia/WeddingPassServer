package router

import (
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/events"
	"weddingpass/server/internal/guests"
	"weddingpass/server/internal/passes"
	"weddingpass/server/internal/pendingguests"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/surveys/survey"
	"weddingpass/server/internal/surveys/surveyResponse"
	"weddingpass/server/internal/users"
)

type Controllers struct {
	EventController          *events.EventController
	GuestController          *guests.GuestController
	AccommodationController  *accommodation.AccommodationController
	PassController           *passes.PassController
	PendingGuestController   *pendingguests.PendingGuestController
	SubEventController       *subevents.SubEventController
	SurveyController         *survey.SurveyController
	SurveyResponseController *surveyResponse.SurveyResponseController
	UserController           *users.UserController
}
