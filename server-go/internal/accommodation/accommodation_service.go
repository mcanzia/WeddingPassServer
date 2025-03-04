package accommodation

import (
	"weddingpass/server/internal/common"
)

type AccommodationService interface {
	common.IBaseService[*AccommodationDTO]
}

type accommodationService struct {
	common.BaseService[*Accommodation, *AccommodationDTO]
	AccommodationRepository AccommodationRepository
	Converter               *AccommodationConverter
}

func NewAccommodationService(repository AccommodationRepository) AccommodationService {
	converter := NewAccommodationConverter()
	base := common.BaseService[*Accommodation, *AccommodationDTO]{
		Repository: repository,
		ConvertToDAO: func(accommodation *AccommodationDTO) (*Accommodation, *common.CustomError) {
			return converter.ConvertAccommodationToDAO(accommodation)
		},
		ConvertToDTO: func(rawAccommodation *Accommodation) (*AccommodationDTO, *common.CustomError) {
			return converter.ConvertAccommodationToDTO(rawAccommodation)
		},
	}
	return &accommodationService{
		BaseService:             base,
		AccommodationRepository: repository,
		Converter:               converter,
	}
}
