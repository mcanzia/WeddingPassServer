package accommodation

import (
	"github.com/gin-gonic/gin"
)

func RegisterAccommodationRoutes(rg *gin.RouterGroup, accommodationCtrl *AccommodationController) {
	accommodationsGroup := rg.Group("/accommodations")
	{
		accommodationsGroup.GET("/", func(c *gin.Context) {
			accommodationCtrl.BaseController.GetAll(c, "eventId")
		})
		accommodationsGroup.GET("/id/:id", func(c *gin.Context) {
			accommodationCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		accommodationsGroup.POST("/", func(c *gin.Context) {
			accommodationCtrl.BaseController.Save(c, "eventId")
		})
		accommodationsGroup.POST("/batch", func(c *gin.Context) {
			accommodationCtrl.BaseController.BatchCreate(c, "eventId")
		})
		// accommodationsGroup.PUT("/:id", func(c *gin.Context) {
		// 	accommodationCtrl.BaseController.Update(c, "eventId", "id")
		// })
		accommodationsGroup.DELETE("/:id", func(c *gin.Context) {
			accommodationCtrl.BaseController.Delete(c, "eventId", "id")
		})
		accommodationsGroup.DELETE("/batch", func(c *gin.Context) {
			accommodationCtrl.BaseController.BatchDelete(c, "eventId")
		})
	}
}
