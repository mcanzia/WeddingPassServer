package subevents

import (
	"net/http"
	"weddingpass/server/internal/common"

	"github.com/gin-gonic/gin"
)

type SubEventController struct {
	BaseController  common.BaseController[*SubEventDTO]
	SubEventService SubEventService
}

func NewSubEventController(service SubEventService) *SubEventController {
	return &SubEventController{
		BaseController: common.BaseController[*SubEventDTO]{
			Service: service,
		},
		SubEventService: service,
	}
}

func (sec *SubEventController) GetSubEventByName(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	subEvent, err := sec.SubEventService.GetSubEventByName(filters)
	if err != nil {
		sec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	sec.BaseController.RespondWithJSON(c, http.StatusOK, subEvent)
}
