package events

import "github.com/gin-gonic/gin"

func RegisterEventRoutes(rg *gin.RouterGroup, eventCtrl *EventController) {
	eventsGroup := rg.Group("/events")
	{
		eventsGroup.GET("/", func(c *gin.Context) {
			eventCtrl.BaseController.GetAll(c)
		})
		eventsGroup.GET("/id/:id", func(c *gin.Context) {
			eventCtrl.BaseController.GetByID(c, "id")
		})
		eventsGroup.GET("/owner/:ownerId", func(c *gin.Context) {
			eventCtrl.GetEventsByOwner(c, "ownerId")
		})
		eventsGroup.GET("/name/:name", func(c *gin.Context) {
			eventCtrl.GetEventByName(c, "name")
		})
		eventsGroup.POST("/", func(c *gin.Context) {
			eventCtrl.BaseController.Save(c)
		})
		eventsGroup.POST("/batch", func(c *gin.Context) {
			eventCtrl.BaseController.BatchCreate(c)
		})
		// eventsGroup.PUT("/:id", func(c *gin.Context) {
		// 	eventCtrl.BaseController.Update(c, "id")
		// })
		eventsGroup.DELETE("/:id", func(c *gin.Context) {
			eventCtrl.BaseController.Delete(c, "id")
		})
		eventsGroup.DELETE("/batch", func(c *gin.Context) {
			eventCtrl.BaseController.BatchDelete(c)
		})
	}
}
