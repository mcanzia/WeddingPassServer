package surveys

import (
	"weddingpass/server/internal/surveys/survey"
	"weddingpass/server/internal/surveys/surveyResponse"

	"github.com/gin-gonic/gin"
)

func RegisterSurveyRoutes(rg *gin.RouterGroup, surveyCtrl *survey.SurveyController, surveyResponseCtrl *surveyResponse.SurveyResponseController) {
	surveysGroup := rg.Group("/surveys")
	{
		surveysGroup.GET("/", func(c *gin.Context) {
			surveyCtrl.BaseController.GetAll(c, "eventId")
		})
		surveysGroup.GET("/id/:id", func(c *gin.Context) {
			surveyCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		surveysGroup.GET("/published", func(c *gin.Context) {
			surveyCtrl.GetPublishedSurveys(c, "eventId")
		})
		surveysGroup.GET("/response/guest/:guest", func(c *gin.Context) {
			surveyResponseCtrl.GetSurveyResponsesForGuest(c, "eventId", "guest")
		})
		surveysGroup.POST("/", func(c *gin.Context) {
			surveyCtrl.BaseController.Save(c, "eventId")
		})
		surveysGroup.POST("/batch", func(c *gin.Context) {
			surveyCtrl.BaseController.BatchCreate(c, "eventId")
		})
		// surveysGroup.PUT("/:id", func(c *gin.Context) {
		// 	surveyCtrl.BaseController.Update(c, "eventId", "id")
		// })
		surveysGroup.DELETE("/id/:id", func(c *gin.Context) {
			surveyCtrl.BaseController.Delete(c, "eventId", "id")
		})
		surveysGroup.DELETE("/batch", func(c *gin.Context) {
			surveyCtrl.BaseController.BatchDelete(c, "eventId")
		})
		surveyResponseGroup := surveysGroup.Group("/:surveyId/response")
		{
			surveyResponseGroup.GET("/", func(c *gin.Context) {
				surveyResponseCtrl.BaseController.GetAll(c, "eventId", "surveyId")
			})
			surveyResponseGroup.GET("/id/:id", func(c *gin.Context) {
				surveyResponseCtrl.BaseController.GetByID(c, "eventId", "surveyId", "id")
			})
			surveyResponseGroup.GET("/guest/:guest", func(c *gin.Context) {
				surveyResponseCtrl.GetSurveyResponseForGuest(c, "eventId", "surveyId", "guest")
			})
			surveyResponseGroup.GET("/party/:id", func(c *gin.Context) {
				surveyResponseCtrl.GetSurveyResponsesForParty(c, "eventId", "surveyId", "id")
			})
			surveyResponseGroup.POST("/", func(c *gin.Context) {
				surveyResponseCtrl.BaseController.Save(c, "eventId", "surveyId")
			})
			surveyResponseGroup.POST("/batch", func(c *gin.Context) {
				surveyResponseCtrl.BaseController.BatchCreate(c, "eventId", "surveyId")
			})
			// surveyResponseGroup.PUT("/:id", func(c *gin.Context) {
			// 	surveyResponseCtrl.BaseController.Update(c, "eventId", "surveyId", "id")
			// })
			surveyResponseGroup.PUT("/party/:id", func(c *gin.Context) {
				surveyResponseCtrl.InitializeSurveyResponsesForParty(c, "eventId", "id")
			})
			surveyResponseGroup.DELETE("/id/:id", func(c *gin.Context) {
				surveyResponseCtrl.BaseController.Delete(c, "eventId", "surveyId", "id")
			})
			surveyResponseGroup.DELETE("/batch", func(c *gin.Context) {
				surveyResponseCtrl.BaseController.BatchDelete(c, "eventId", "surveyId")
			})
		}
	}
}
