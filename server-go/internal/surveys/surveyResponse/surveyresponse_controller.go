package surveyResponse

import (
	"net/http"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/surveys/surveys_models"

	"github.com/gin-gonic/gin"
)

type SurveyResponseController struct {
	BaseController        common.BaseController[*surveys_models.SurveyResponseDTO]
	SurveyResponseService SurveyResponseService
}

func NewSurveyResponseController(service SurveyResponseService) *SurveyResponseController {
	return &SurveyResponseController{
		BaseController: common.BaseController[*surveys_models.SurveyResponseDTO]{
			Service: service,
		},
		SurveyResponseService: service,
	}
}

func (src *SurveyResponseController) GetSurveyResponsesForGuest(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	surveyResponses, err := src.SurveyResponseService.GetSurveyResponsesForGuest(filters)
	if err != nil {
		src.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	src.BaseController.RespondWithJSON(c, http.StatusOK, surveyResponses)
}

func (src *SurveyResponseController) GetSurveyResponseForGuest(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	surveyResponse, err := src.SurveyResponseService.GetSurveyResponseForGuest(filters)
	if err != nil {
		src.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	src.BaseController.RespondWithJSON(c, http.StatusOK, surveyResponse)
}

func (src *SurveyResponseController) InitializeSurveyResponsesForParty(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)

	var survey surveys_models.SurveyDTO
	if err := c.ShouldBindJSON(&survey); err != nil {
		src.BaseController.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	surveyResponses, err := src.SurveyResponseService.InitializeSurveyResponsesForParty(filters, survey)
	if err != nil {
		src.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	src.BaseController.RespondWithJSON(c, http.StatusOK, surveyResponses)
}

func (src *SurveyResponseController) GetSurveyResponsesForParty(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	surveyResponses, err := src.SurveyResponseService.GetSurveyResponsesForParty(filters)
	if err != nil {
		src.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	src.BaseController.RespondWithJSON(c, http.StatusOK, surveyResponses)
}
