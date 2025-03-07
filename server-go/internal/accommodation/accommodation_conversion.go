package accommodation

import "weddingpass/server/internal/common"

type AccommodationConverter struct {
}

func NewAccommodationConverter() *AccommodationConverter {
	return &AccommodationConverter{}
}

func (ac *AccommodationConverter) ConvertAccommodationToDTO(raw *Accommodation) (*AccommodationDTO, *common.CustomError) {
	accommodationDTO := AccommodationDTO{
		Id:         raw.Id,
		EventId:    raw.EventId,
		Type:       raw.Type,
		RoomNumber: raw.RoomNumber,
		Name:       raw.Name,
		Location:   raw.Location,
	}

	return &accommodationDTO, nil
}

func (ac *AccommodationConverter) ConvertAccommodationToDAO(accommodationDTO *AccommodationDTO) (*Accommodation, *common.CustomError) {
	accommodation := Accommodation{
		Id:         accommodationDTO.Id,
		EventId:    accommodationDTO.EventId,
		Type:       accommodationDTO.Type,
		RoomNumber: accommodationDTO.RoomNumber,
		Name:       accommodationDTO.Name,
		Location:   accommodationDTO.Location,
	}
	return &accommodation, nil
}
