package guests

import (
	"net/http"
	"path/filepath"
	"strings"
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
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if len(guests) == 0 {
		ec.BaseController.RespondWithJSON(c, http.StatusNoContent, guests)
	} else {
		ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
	}
}

func (ec *GuestController) GetGuestByName(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guest, err := ec.GuestService.GetGuestByName(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guest)
}

func (ec *GuestController) GetGuestsByPhone(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsByPhone(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if len(guests) == 0 {
		ec.BaseController.RespondWithJSON(c, http.StatusNoContent, guests)
	} else {
		ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
	}
}

func (ec *GuestController) GetGuestsByEmail(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsByEmail(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if len(guests) == 0 {
		ec.BaseController.RespondWithJSON(c, http.StatusNoContent, guests)
	} else {
		ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
	}
}

func (ec *GuestController) GetGuestBySerialNumber(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guest, err := ec.GuestService.GetGuestBySerialNumber(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, guest)
}

func (ec *GuestController) GetGuestsForSubEvent(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsForSubEvent(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if len(guests) == 0 {
		ec.BaseController.RespondWithJSON(c, http.StatusNoContent, guests)
	} else {
		ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
	}
}

func (ec *GuestController) GetGuestsByHotel(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	guests, err := ec.GuestService.GetGuestsByHotel(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	if len(guests) == 0 {
		ec.BaseController.RespondWithJSON(c, http.StatusNoContent, guests)
	} else {
		ec.BaseController.RespondWithJSON(c, http.StatusOK, guests)
	}
}

func (ec *GuestController) UploadGuests(c *gin.Context, lookupKeys ...string) {
	if err := c.Request.ParseMultipartForm(32 << 20); err != nil {
		ec.BaseController.RespondWithError(c, http.StatusBadRequest, "Invalid multipart form")
		return
	}

	fileHeader, err := c.FormFile("file")
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusBadRequest, "File not provided")
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	defer file.Close()

	ext := strings.ToLower(filepath.Ext(fileHeader.Filename))

	filters := common.GetFiltersFromContext(c, lookupKeys...)
	uploadGuestLists, uploadErr := ec.GuestService.UploadGuests(filters, file, ext)
	if uploadErr != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, uploadErr.Error())
		return
	}
	uploadValidation, validateErr := ec.GuestService.ValidateGuests(filters, uploadGuestLists)
	if validateErr != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, validateErr.Error())
		return
	}
	ec.BaseController.RespondWithJSON(c, http.StatusOK, uploadValidation)
}

func (ec *GuestController) DownloadGuests(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	csv, err := ec.GuestService.GenerateCSVContent(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusInternalServerError, err.Error())
		return
	}
	ec.BaseController.RespondWithCSV(c, http.StatusOK, csv, "guests.csv")
}
