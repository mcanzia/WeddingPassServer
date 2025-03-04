package pendingguests

import (
	"net/http"
	"weddingpass/server/internal/common"

	"github.com/gin-gonic/gin"
)

type PendingGuestController struct {
	BaseController      common.BaseController[*PendingGuestDTO]
	PendingGuestService PendingGuestService
}

func NewPendingGuestController(service PendingGuestService) *PendingGuestController {
	return &PendingGuestController{
		BaseController: common.BaseController[*PendingGuestDTO]{
			Service: service,
		},
		PendingGuestService: service,
	}
}

func (pc *PendingGuestController) LinkPendingGuest(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)

	var guestLink GuestLink
	if err := c.ShouldBindJSON(&guestLink); err != nil {
		pc.BaseController.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	pendingGuest, err := pc.PendingGuestService.LinkPendingGuest(filters, guestLink)
	if err != nil {
		pc.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	pc.BaseController.RespondWithJSON(c, http.StatusOK, pendingGuest)
}
