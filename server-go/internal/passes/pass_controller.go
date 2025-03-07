package passes

import (
	"weddingpass/server/internal/common"
)

// Note - PassService is only needed if implementing additional methods not found in generic classes
type PassController struct {
	BaseController common.BaseController[*PassDTO]
	PassService    PassService
}

func NewPassController(service PassService) *PassController {
	return &PassController{
		BaseController: common.BaseController[*PassDTO]{
			Service: service,
		},
		PassService: service,
	}
}
