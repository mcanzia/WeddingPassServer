package pendingguests

import "github.com/gin-gonic/gin"

func RegisterPendingGuestRoutes(rg *gin.RouterGroup, pendingGuestCtrl *PendingGuestController) {
	pendingGuestsGroup := rg.Group("/pending-guests")
	{
		pendingGuestsGroup.GET("/", func(c *gin.Context) {
			pendingGuestCtrl.BaseController.GetAll(c, "eventId")
		})
		pendingGuestsGroup.GET("/id/:id", func(c *gin.Context) {
			pendingGuestCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		pendingGuestsGroup.POST("/", func(c *gin.Context) {
			pendingGuestCtrl.BaseController.Save(c, "eventId")
		})
		pendingGuestsGroup.POST("/batch", func(c *gin.Context) {
			pendingGuestCtrl.BaseController.BatchCreate(c, "eventId")
		})
		pendingGuestsGroup.POST("/link", func(c *gin.Context) {
			pendingGuestCtrl.LinkPendingGuest(c, "eventId")
		})
		pendingGuestsGroup.DELETE("/:id", func(c *gin.Context) {
			pendingGuestCtrl.BaseController.Delete(c, "eventId", "id")
		})
		pendingGuestsGroup.DELETE("/batch", func(c *gin.Context) {
			pendingGuestCtrl.BaseController.BatchDelete(c, "eventId")
		})
	}
}
