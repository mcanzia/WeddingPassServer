package passes

import "github.com/gin-gonic/gin"

func RegisterPassRoutes(rg *gin.RouterGroup, passCtrl *PassController) {
	passGroup := rg.Group("/pass")
	{
		passGroup.GET("/", func(c *gin.Context) {
			passCtrl.BaseController.GetAll(c, "eventId")
		})
		passGroup.GET("/id/:id", func(c *gin.Context) {
			passCtrl.BaseController.GetByID(c, "eventId", "id")
		})
		passGroup.POST("/", func(c *gin.Context) {
			passCtrl.BaseController.Save(c, "eventId")
		})
		passGroup.POST("/batch", func(c *gin.Context) {
			passCtrl.BaseController.BatchCreate(c, "eventId")
		})
		// passGroup.PUT("/:id", func(c *gin.Context) {
		// 	passCtrl.BaseController.Update(c, "eventId", "id")
		// })
		passGroup.DELETE("/:id", func(c *gin.Context) {
			passCtrl.BaseController.Delete(c, "eventId", "id")
		})
		passGroup.DELETE("/batch", func(c *gin.Context) {
			passCtrl.BaseController.BatchDelete(c, "eventId")
		})
	}
}
