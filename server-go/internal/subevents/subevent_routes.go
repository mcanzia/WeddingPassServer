package subevents

import "github.com/gin-gonic/gin"

func RegisterSubEventRoutes(rg *gin.RouterGroup, subEventCtrl *SubEventController) {
	subEventsGroup := rg.Group("/subevents")
	{
		subEventsGroup.GET("/", func(c *gin.Context) {
			subEventCtrl.BaseController.GetAll(c, "eventId")
		})
		subEventsGroup.GET("/id/:id", func(c *gin.Context) {
			subEventCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		subEventsGroup.GET("/name/:name", func(c *gin.Context) {
			subEventCtrl.GetSubEventByName(c, "eventId", "name")
		})
		subEventsGroup.POST("/", func(c *gin.Context) {
			subEventCtrl.BaseController.Save(c, "eventId")
		})
		subEventsGroup.POST("/batch", func(c *gin.Context) {
			subEventCtrl.BaseController.BatchCreate(c, "eventId")
		})
		// subEventsGroup.PUT("/:id", func(c *gin.Context) {
		// 	subEventCtrl.BaseController.Update(c, "eventId", "id")
		// })
		subEventsGroup.DELETE("/batch", func(c *gin.Context) {
			subEventCtrl.BaseController.BatchDelete(c, "eventId")
		})
	}
}
