package users

import (
	"net/http"
	"weddingpass/server/internal/common"

	"github.com/gin-gonic/gin"
)

type UserController struct {
	BaseController common.BaseController[*UserDTO]
	UserService    UserService
}

func NewUserController(service UserService) *UserController {
	return &UserController{
		BaseController: common.BaseController[*UserDTO]{
			Service: service,
		},
		UserService: service,
	}
}

func (uc *UserController) GetUserByPhone(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)

	user, err := uc.UserService.GetUserByPhone(filters)
	if err != nil {
		uc.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	uc.BaseController.RespondWithJSON(c, http.StatusOK, user)
}

func (uc *UserController) GetUserByEmail(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	user, err := uc.UserService.GetUserByEmail(filters)
	if err != nil {
		uc.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	uc.BaseController.RespondWithJSON(c, http.StatusOK, user)
}

func (uc *UserController) GenerateInviteLink(c *gin.Context, lookupKeys ...string) {
	var eventRole EventRoleDTO
	if err := c.ShouldBindJSON(&eventRole); err != nil {
		uc.BaseController.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	inviteToken, err := uc.UserService.GenerateInviteLink(&eventRole)

	if err != nil {
		uc.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	uc.BaseController.RespondWithJSON(c, http.StatusOK, inviteToken)

}

func (uc *UserController) ProcessInvite(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)

	var inviteToken InviteTokenDTO
	if err := c.ShouldBindJSON(&inviteToken); err != nil {
		uc.BaseController.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	eventRole, err := uc.UserService.ProcessInvite(filters, &inviteToken)

	if err != nil {
		uc.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	uc.BaseController.RespondWithJSON(c, http.StatusOK, eventRole)

}

func (uc *UserController) AddUserToWedding(c *gin.Context, lookupKeys ...string) {
	filters := common.GetFiltersFromContext(c, lookupKeys...)
	var eventRole EventRoleDTO
	if err := c.ShouldBindJSON(&eventRole); err != nil {
		uc.BaseController.RespondWithError(c, http.StatusBadRequest, err.Error())
		return
	}

	newEventRole, err := uc.UserService.AddUserToWedding(filters, &eventRole)

	if err != nil {
		uc.BaseController.RespondWithError(c, http.StatusNotFound, err.Error())
		return
	}
	uc.BaseController.RespondWithJSON(c, http.StatusOK, newEventRole)

}
