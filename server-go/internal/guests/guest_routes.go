package guests

import "github.com/gin-gonic/gin"

func RegisterGuestRoutes(rg *gin.RouterGroup, guestCtrl *GuestController) {
	guestsGroup := rg.Group("/guests")
	{
		guestsGroup.GET("/", func(c *gin.Context) {
			guestCtrl.BaseController.GetAll(c, "eventId")
		})
		guestsGroup.GET("/id/:id", func(c *gin.Context) {
			guestCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		guestsGroup.GET("/party/:id", func(c *gin.Context) {
			guestCtrl.FetchPartyMembers(c, "eventId", "id")
		})
		guestsGroup.GET("/name/:name", func(c *gin.Context) {
			guestCtrl.GetGuestByName(c, "eventId", "name")
		})
		guestsGroup.GET("/phone/:phone", func(c *gin.Context) {
			guestCtrl.GetGuestsByPhone(c, "eventId", "phone")
		})
		guestsGroup.GET("/email/:email", func(c *gin.Context) {
			guestCtrl.GetGuestsByEmail(c, "eventId", "email")
		})
		guestsGroup.GET("/serial/:serialNumber", func(c *gin.Context) {
			guestCtrl.GetGuestBySerialNumber(c, "eventId", "serialNumber")
		})
		guestsGroup.GET("/subevent/:subEventId", func(c *gin.Context) {
			guestCtrl.GetGuestsForSubEvent(c, "eventId", "subEventId")
		})
		guestsGroup.GET("/hotel/:hotelId", func(c *gin.Context) {
			guestCtrl.GetGuestsByHotel(c, "eventId", "hotelId")
		})
		guestsGroup.GET("/download", func(c *gin.Context) {
			guestCtrl.DownloadGuests(c, "eventId")
		})
		guestsGroup.POST("/", func(c *gin.Context) {
			guestCtrl.BaseController.Save(c, "eventId")
		})
		guestsGroup.POST("/batch", func(c *gin.Context) {
			guestCtrl.BaseController.BatchCreate(c, "eventId")
		})
		guestsGroup.POST("/upload", func(c *gin.Context) {
			guestCtrl.UploadGuests(c, "eventId")
		})
		// guestsGroup.PUT("/:id", func(c *gin.Context) {
		// 	guestCtrl.BaseController.Update(c, "eventId", "id")
		// })
		guestsGroup.DELETE("/:id", func(c *gin.Context) {
			guestCtrl.BaseController.Delete(c, "eventId", "id")
		})
		guestsGroup.DELETE("/batch", func(c *gin.Context) {
			guestCtrl.BaseController.BatchDelete(c, "eventId")
		})
	}
}
