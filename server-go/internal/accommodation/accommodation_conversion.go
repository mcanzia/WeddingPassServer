package accommodation

type AccommodationConverter struct {
}

func NewAccommodationConverter() *AccommodationConverter {
	return &AccommodationConverter{}
}

func (ac *AccommodationConverter) ConvertBaseAccommodationToDTO(ba BaseAccommodation) BaseAccommodationDTO {
	return BaseAccommodationDTO{
		Id:      ba.Id,
		EventId: ba.EventId,
		Type:    ba.Type,
	}
}

func (ac *AccommodationConverter) ConvertBaseAccommodationToDAO(ba BaseAccommodationDTO) BaseAccommodation {
	return BaseAccommodation{
		Id:      ba.Id,
		EventId: ba.EventId,
		Type:    ba.Type,
	}
}

func (ac *AccommodationConverter) ConvertHotelToDAO(hotel *HotelDTO) (*Hotel, error) {
	baseDAO := ac.ConvertBaseAccommodationToDAO(hotel.BaseAccommodationDTO)

	dao := &Hotel{
		BaseAccommodation: baseDAO,
		RoomNumber:        hotel.RoomNumber,
		Name:              hotel.Name,
		Location:          hotel.Location,
	}
	return dao, nil
}

func (ac *AccommodationConverter) ConvertHotelToDTO(rawHotel *Hotel) (*HotelDTO, error) {
	baseDTO := ac.ConvertBaseAccommodationToDTO(rawHotel.BaseAccommodation)

	dto := &HotelDTO{
		BaseAccommodationDTO: baseDTO,
		RoomNumber:           rawHotel.RoomNumber,
		Name:                 rawHotel.Name,
		Location:             rawHotel.Location,
	}
	return dto, nil
}
