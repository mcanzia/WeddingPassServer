package accommodation

import (
	"weddingpass/server/internal/common"
)

type HotelController struct {
	BaseController common.BaseController[*HotelDTO]
	HotelService   HotelService
}

func NewHotelController(service HotelService) *HotelController {
	return &HotelController{
		BaseController: common.BaseController[*HotelDTO]{
			Service: service,
		},
		HotelService: service,
	}
}
