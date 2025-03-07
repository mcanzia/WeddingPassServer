package survey

import (
	"net/http"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/surveys/surveys_models"

	"github.com/gin-gonic/gin"
)

type SurveyController struct {
	BaseController common.BaseController[*surveys_models.SurveyDTO]
	SurveyService  SurveyService
}

func NewSurveyController(service SurveyService) *SurveyController {
	return &SurveyController{
		BaseController: common.BaseController[*surveys_models.SurveyDTO]{
			Service: service,
		},
		SurveyService: service,
	}
}

func (ec *SurveyController) GetPublishedSurveys(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	surveys, err := ec.SurveyService.GetPublishedSurveys(filters)
	if err != nil {
		ec.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	if len(surveys) == 0 {
		ec.BaseController.RespondWithJSON(c, http.StatusNoContent, surveys)
	} else {
		ec.BaseController.RespondWithJSON(c, http.StatusOK, surveys)
	}
}
