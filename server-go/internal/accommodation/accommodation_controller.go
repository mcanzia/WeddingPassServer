package accommodation

import (
	"weddingpass/server/internal/common"
)

type AccommodationController struct {
	BaseController       common.BaseController[*AccommodationDTO]
	AccommodationService AccommodationService
}

func NewAccommodationController(service AccommodationService) *AccommodationController {
	return &AccommodationController{
		BaseController: common.BaseController[*AccommodationDTO]{
			Service: service,
		},
		AccommodationService: service,
	}
}
