package users

import (
	"github.com/gin-gonic/gin"
)

func RegisterUserRoutes(rg *gin.RouterGroup, userCtrl *UserController) {
	usersGroup := rg.Group("/users")
	{
		usersGroup.GET("/", func(c *gin.Context) {
			userCtrl.BaseController.GetAll(c)
		})
		usersGroup.GET("/id/:id", func(c *gin.Context) {
			userCtrl.BaseController.GetByID(c, "id")
		})
		usersGroup.GET("/phone/:phone", func(c *gin.Context) {
			userCtrl.GetUserByPhone(c, "phone")
		})
		usersGroup.GET("/email/:email", func(c *gin.Context) {
			userCtrl.GetUserByEmail(c, "email")
		})
		usersGroup.POST("/", func(c *gin.Context) {
			userCtrl.BaseController.Save(c)
		})
		usersGroup.POST("/batch", func(c *gin.Context) {
			userCtrl.BaseController.BatchCreate(c)
		})
		usersGroup.POST("/:eventId/invite", func(c *gin.Context) {
			userCtrl.GenerateInviteLink(c, "eventId")
		})
		usersGroup.POST("/process-invite", func(c *gin.Context) {
			userCtrl.ProcessInvite(c)
		})
		usersGroup.POST("/roles", func(c *gin.Context) {
			userCtrl.AddUserToWedding(c)
		})
		// usersGroup.PUT("/:id", func(c *gin.Context) {
		// 	userCtrl.BaseController.Update(c, "id")
		// })
		usersGroup.DELETE("/:id", func(c *gin.Context) {
			userCtrl.BaseController.Delete(c, "id")
		})
		usersGroup.DELETE("/batch", func(c *gin.Context) {
			userCtrl.BaseController.BatchDelete(c)
		})
	}
}
