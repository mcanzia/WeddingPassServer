package events

import (
	"net/http"
	"weddingpass/server/internal/common"

	"github.com/gin-gonic/gin"
)

type EventController struct {
	BaseController common.BaseController[*EventDTO]
	EventService   EventService
}

func NewEventController(service EventService) *EventController {
	return &EventController{
		BaseController: common.BaseController[*EventDTO]{
			Service: service,
		},
		EventService: service,
	}
}

func (ec *EventController) GetEventsByOwner(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	events, err := ec.EventService.GetEventsByOwner(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, events)
}

func (ec *EventController) GetEventByName(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	event, err := ec.EventService.GetEventByName(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, event)
}
