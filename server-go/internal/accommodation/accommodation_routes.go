package accommodation

import (
	"github.com/gin-gonic/gin"
)

func RegisterHotelRoutes(rg *gin.RouterGroup, hotelCtrl *HotelController) {
	hotelsGroup := rg.Group("/hotels")
	{
		hotelsGroup.GET("/", func(c *gin.Context) {
			hotelCtrl.BaseController.GetAll(c, "eventId")
		})
		hotelsGroup.GET("/id/:id", func(c *gin.Context) {
			hotelCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		hotelsGroup.POST("/", func(c *gin.Context) {
			hotelCtrl.BaseController.Save(c, "eventId")
		})
		hotelsGroup.POST("/batch", func(c *gin.Context) {
			hotelCtrl.BaseController.BatchCreate(c, "eventId")
		})
		// hotelsGroup.PUT("/:id", func(c *gin.Context) {
		// 	hotelCtrl.BaseController.Update(c, "eventId", "id")
		// })
		hotelsGroup.DELETE("/:id", func(c *gin.Context) {
			hotelCtrl.BaseController.Delete(c, "eventId", "id")
		})
		hotelsGroup.DELETE("/batch", func(c *gin.Context) {
			hotelCtrl.BaseController.BatchDelete(c, "eventId")
		})
	}
}
