package accommodation

import (
	"weddingpass/server/internal/common"
)

type HotelService interface {
	common.IBaseService[*HotelDTO]
}

type hotelService struct {
	common.BaseService[*Hotel, *HotelDTO]
	HotelRepository HotelRepository
	Converter       *AccommodationConverter
}

func NewHotelService(repository HotelRepository) HotelService {
	converter := NewAccommodationConverter()
	base := common.BaseService[*Hotel, *HotelDTO]{
		Repository: repository,
		ConvertToDAO: func(hotel *HotelDTO) (*Hotel, error) {
			return converter.ConvertHotelToDAO(hotel)
		},
		ConvertToDTO: func(rawHotel *Hotel) (*HotelDTO, error) {
			return converter.ConvertHotelToDTO(rawHotel)
		},
	}
	return &hotelService{
		BaseService: base,
		Converter:   converter,
	}
}
