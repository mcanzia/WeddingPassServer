package router

import (
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/events"
	"weddingpass/server/internal/guests"
	"weddingpass/server/internal/middleware"
	"weddingpass/server/internal/passes"
	"weddingpass/server/internal/pendingguests"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/surveys"
	"weddingpass/server/internal/users"

	"github.com/gin-gonic/gin"
)

func SetupRouter(ctrls *Controllers) *gin.Engine {
	r := gin.Default()

	// Apply global middleware if any, e.g., logging, authentication
	r.RedirectTrailingSlash = false
	r.Use(middleware.CorsMiddleware())
	r.Use(middleware.AuthMiddleware())

	// Register Routes
	apiRoute := r.Group("/api")
	events.RegisterEventRoutes(apiRoute, ctrls.EventController)
	users.RegisterUserRoutes(apiRoute, ctrls.UserController)

	eventSpecificRoute := apiRoute.Group("/events/:eventId")
	guests.RegisterGuestRoutes(eventSpecificRoute, ctrls.GuestController)
	accommodation.RegisterAccommodationRoutes(eventSpecificRoute, ctrls.AccommodationController)
	passes.RegisterPassRoutes(eventSpecificRoute, ctrls.PassController)
	pendingguests.RegisterPendingGuestRoutes(eventSpecificRoute, ctrls.PendingGuestController)
	subevents.RegisterSubEventRoutes(eventSpecificRoute, ctrls.SubEventController)
	surveys.RegisterSurveyRoutes(eventSpecificRoute, ctrls.SurveyController, ctrls.SurveyResponseController)

	return r
}
