package dependencies

import (
	"context"
	"fmt"
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/events"
	"weddingpass/server/internal/firebase"
	"weddingpass/server/internal/guests"
	"weddingpass/server/internal/logger"
	"weddingpass/server/internal/passes"
	"weddingpass/server/internal/pendingguests"
	"weddingpass/server/internal/router"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/surveys/survey"
	"weddingpass/server/internal/surveys/surveyResponse"
	"weddingpass/server/internal/surveys/surveys_models"
	"weddingpass/server/internal/transportation"
	"weddingpass/server/internal/users"
	"weddingpass/server/internal/util"

	"cloud.google.com/go/firestore"
	"go.uber.org/dig"
)

func InitDependencies(container *dig.Container, ctx context.Context) error {
	if err := util.ChainFunctions(
		func() error { return initFirebase(container, ctx) },
		func() error { return initControllers(container) },
		func() error { return initServices(container) },
		func() error { return initRepositorys(container) },
		func() error { return initConverters(container) },
	); err != nil {
		logger.Global.Error(fmt.Sprintf("Error initializing dependencies: %v", err))
		return err
	}
	return nil
}

func initFirebase(container *dig.Container, ctx context.Context) error {
	return util.ChainFunctions(
		func() error {
			return container.Provide(func() context.Context {
				return ctx
			})
		},
		func() error {
			return container.Provide(func() *firestore.Client {
				return firebase.FirestoreClient
			})
		},
	)

}

func initControllers(container *dig.Container) error {
	return util.ChainFunctions(
		func() error { return container.Provide(events.NewEventController) },
		func() error { return container.Provide(guests.NewGuestController) },
		func() error { return container.Provide(accommodation.NewAccommodationController) },
		func() error { return container.Provide(passes.NewPassController) },
		func() error { return container.Provide(pendingguests.NewPendingGuestController) },
		func() error { return container.Provide(subevents.NewSubEventController) },
		func() error { return container.Provide(survey.NewSurveyController) },
		func() error { return container.Provide(surveyResponse.NewSurveyResponseController) },
		func() error { return container.Provide(users.NewUserController) },
		func() error {
			return container.Provide(func(
				eventCtrl *events.EventController,
				guestCtrl *guests.GuestController,
				accommodationCtrl *accommodation.AccommodationController,
				passCtrl *passes.PassController,
				pendingGuestCtrl *pendingguests.PendingGuestController,
				subEventCtrl *subevents.SubEventController,
				surveyCtrl *survey.SurveyController,
				surveyResponseCtrl *surveyResponse.SurveyResponseController,
				userCtrl *users.UserController,
			) *router.Controllers {
				return &router.Controllers{
					EventController:          eventCtrl,
					GuestController:          guestCtrl,
					AccommodationController:  accommodationCtrl,
					PassController:           passCtrl,
					PendingGuestController:   pendingGuestCtrl,
					SubEventController:       subEventCtrl,
					SurveyController:         surveyCtrl,
					SurveyResponseController: surveyResponseCtrl,
					UserController:           userCtrl,
				}
			})
		},
	)
}

func initServices(container *dig.Container) error {
	return util.ChainFunctions(
		func() error { return container.Provide(events.NewEventService) },
		func() error { return container.Provide(guests.NewGuestService) },
		func() error { return container.Provide(accommodation.NewAccommodationService) },
		func() error { return container.Provide(passes.NewPassService) },
		func() error { return container.Provide(pendingguests.NewPendingGuestService) },
		func() error { return container.Provide(subevents.NewSubEventService) },
		func() error { return container.Provide(survey.NewSurveyService) },
		func() error { return container.Provide(surveyResponse.NewSurveyResponseService) },
		func() error { return container.Provide(users.NewUserService) },
	)
}

func initRepositorys(container *dig.Container) error {
	return util.ChainFunctions(
		func() error { return container.Provide(events.NewEventRepository) },
		func() error { return container.Provide(guests.NewGuestRepository) },
		func() error { return container.Provide(accommodation.NewAccommodationRepository) },
		func() error { return container.Provide(passes.NewPassRepository) },
		func() error { return container.Provide(pendingguests.NewPendingGuestRepository) },
		func() error { return container.Provide(subevents.NewSubEventRepository) },
		func() error { return container.Provide(survey.NewSurveyRepository) },
		func() error { return container.Provide(surveyResponse.NewSurveyResponseRepository) },
		func() error { return container.Provide(users.NewUserRepository) },
		func() error { return container.Provide(users.NewInviteTokenRepository) },
	)
}

func initConverters(container *dig.Container) error {
	return util.ChainFunctions(
		func() error { return container.Provide(accommodation.NewAccommodationConverter) },
		func() error { return container.Provide(drinks.NewDrinksConverter) },
		func() error { return container.Provide(events.NewEventConverter) },
		func() error { return container.Provide(guests.NewGuestConverter) },
		func() error { return container.Provide(passes.NewPassConverter) },
		func() error { return container.Provide(pendingguests.NewPendingGuestConverter) },
		func() error { return container.Provide(subevents.NewSubEventConverter) },
		func() error { return container.Provide(surveys_models.NewSurveyConverter) },
		func() error { return container.Provide(transportation.NewTransportationConverter) },
		func() error { return container.Provide(users.NewUserConverter) },
	)
}
