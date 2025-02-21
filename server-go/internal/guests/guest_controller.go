package guests

import (
	"net/http"
	"weddingpass/server/internal/common"

	"github.com/gin-gonic/gin"
)

type GuestController struct {
	BaseController common.BaseController[*GuestDTO]
	GuestService   GuestService
}

func NewGuestController(service GuestService) *GuestController {
	return &GuestController{
		BaseController: common.BaseController[*GuestDTO]{
			Service: service,
		},
		GuestService: service,
	}
}

func (ec *GuestController) FetchPartyMembers(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.FetchPartyMembers(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
}

func (ec *GuestController) GetGuestByName(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guest, err := ec.GuestService.GetGuestByName(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guest)
}

func (ec *GuestController) GetGuestsByPhone(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsByPhone(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
}

func (ec *GuestController) GetGuestsByEmail(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsByEmail(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
}

func (ec *GuestController) GetGuestBySerialNumber(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guest, err := ec.GuestService.GetGuestBySerialNumber(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guest)
}

func (ec *GuestController) GetGuestsForSubEvent(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsForSubEvent(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
}

func (ec *GuestController) GetGuestsByHotel(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsByHotel(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
}

func (ec *GuestController) UploadGuests(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	uploadValidation, err := ec.GuestService.UploadGuests(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, uploadValidation)
}

// TODO RETURN CSV
func (ec *GuestController) DownloadGuests(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.DownloadGuests(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
}
