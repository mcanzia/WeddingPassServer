package guests

import (
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/transportation"
)

type GuestConverter struct {
	TransportationConverter *transportation.TransportationConverter
	SubEventConverter       *subevents.SubEventConverter
	SubEventService         subevents.SubEventService
	DrinksConverter         *drinks.DrinksConverter
	AccommodationConverter  *accommodation.AccommodationConverter
}

func NewGuestConverter(transportationConverter *transportation.TransportationConverter,
	subEventConverter *subevents.SubEventConverter,
	subEventService subevents.SubEventService,
	drinksConverter *drinks.DrinksConverter,
	accommodationConverter *accommodation.AccommodationConverter) *GuestConverter {
	return &GuestConverter{
		TransportationConverter: transportationConverter,
		SubEventConverter:       subEventConverter,
		SubEventService:         subEventService,
		DrinksConverter:         drinksConverter,
		AccommodationConverter:  accommodationConverter,
	}
}

func (gc *GuestConverter) ConvertGuestToDAO(guestDto *GuestDTO) (*Guest, *common.CustomError) {

	guest := &Guest{
		Id:                  guestDto.Id,
		EventId:             guestDto.EventId,
		GroupNumber:         guestDto.GroupNumber,
		Name:                guestDto.Name,
		Email:               guestDto.Email,
		Phone:               guestDto.Phone,
		SerialNumber:        guestDto.SerialNumber,
		DietaryRestrictions: guestDto.DietaryRestrictions,
	}

	for _, subEventDto := range guestDto.SubEvents {
		subEventId := subEventDto.Id
		guest.SubEvents = append(guest.SubEvents, subEventId)
	}

	for _, subEventDto := range guestDto.AttendingSubEvents {
		subEventId := subEventDto.Id
		guest.AttendingSubEvents = append(guest.AttendingSubEvents, subEventId)
	}

	arrival, err := gc.TransportationConverter.ConvertTransportationToDAO(&guestDto.Arrival)
	if err != nil {
		return nil, err
	}
	guest.Arrival = *arrival

	departure, err := gc.TransportationConverter.ConvertTransportationToDAO(&guestDto.Departure)
	if err != nil {
		return nil, err
	}
	guest.Departure = *departure

	drinks, err := gc.DrinksConverter.ConvertDrinksToDAO(&guestDto.Drinks)
	if err != nil {
		return nil, err
	}
	guest.Drinks = *drinks

	accommodation, err := gc.AccommodationConverter.ConvertAccommodationToDAO(&guestDto.Accommodation)
	if err != nil {
		return nil, err
	}
	guest.Accommodation = *accommodation

	return guest, nil
}

func (gc *GuestConverter) ConvertGuestToDTO(raw *Guest) (*GuestDTO, *common.CustomError) {

	dto := &GuestDTO{
		Id:                  raw.Id,
		EventId:             raw.EventId,
		GroupNumber:         raw.GroupNumber,
		Name:                raw.Name,
		Email:               raw.Email,
		Phone:               raw.Phone,
		SerialNumber:        raw.SerialNumber,
		DietaryRestrictions: raw.DietaryRestrictions,
	}

	for _, subEventId := range raw.SubEvents {
		params := map[string]string{
			"eventId": raw.EventId,
			"id":      subEventId,
		}
		subEventDTO, err := gc.SubEventService.GetByID(params)
		if err != nil {
			return nil, err
		}
		dto.SubEvents = append(dto.SubEvents, *subEventDTO)
	}

	for _, subEventId := range raw.AttendingSubEvents {
		params := map[string]string{
			"eventId": raw.EventId,
			"id":      subEventId,
		}
		subEventDTO, err := gc.SubEventService.GetByID(params)
		if err != nil {
			return nil, err
		}
		dto.AttendingSubEvents = append(dto.AttendingSubEvents, *subEventDTO)
	}

	arrivalDTO, err := gc.TransportationConverter.ConvertTransportationToDTO(&raw.Arrival)
	if err != nil {
		return nil, err
	}
	dto.Arrival = *arrivalDTO

	departureDTO, err := gc.TransportationConverter.ConvertTransportationToDTO(&raw.Departure)
	if err != nil {
		return nil, err
	}
	dto.Departure = *departureDTO

	drinksDTO, err := gc.DrinksConverter.ConvertDrinksToDTO(&raw.Drinks)
	if err != nil {
		return nil, err
	}
	dto.Drinks = *drinksDTO

	accommodationDTO, err := gc.AccommodationConverter.ConvertAccommodationToDTO(&raw.Accommodation)
	if err != nil {
		return nil, err
	}
	dto.Accommodation = *accommodationDTO

	return dto, nil
}

func (gc *GuestConverter) ConvertUploadGuestListsToDAO(uploadGuestListsDto *UploadGuestListsDTO) (*UploadGuestLists, *common.CustomError) {
	uploadGuestLists := &UploadGuestLists{}

	for _, guestDto := range uploadGuestListsDto.CreateGuests {
		rawGuest, err := gc.ConvertGuestToDAO(&guestDto)
		if err != nil {
			return nil, err
		}
		uploadGuestLists.CreateGuests = append(uploadGuestLists.CreateGuests, *rawGuest)
	}

	for _, guestDto := range uploadGuestListsDto.UpdateGuests {
		rawGuest, err := gc.ConvertGuestToDAO(&guestDto)
		if err != nil {
			return nil, err
		}
		uploadGuestLists.UpdateGuests = append(uploadGuestLists.UpdateGuests, *rawGuest)
	}

	return uploadGuestLists, nil
}

func (gc *GuestConverter) ConvertUploadGuestListsToDTO(raw *UploadGuestLists) (*UploadGuestListsDTO, *common.CustomError) {
	dto := &UploadGuestListsDTO{}

	for _, guest := range raw.CreateGuests {
		guestDTO, err := gc.ConvertGuestToDTO(&guest)
		if err != nil {
			return nil, err
		}
		dto.CreateGuests = append(dto.CreateGuests, *guestDTO)
	}

	for _, guest := range raw.UpdateGuests {
		guestDTO, err := gc.ConvertGuestToDTO(&guest)
		if err != nil {
			return nil, err
		}
		dto.UpdateGuests = append(dto.UpdateGuests, *guestDTO)
	}

	return dto, nil
}

func (gc *GuestConverter) ConvertUploadValidationToDAO(uploadValidationDto *UploadValidationDTO) (*UploadValidation, *common.CustomError) {
	if uploadValidationDto == nil {
		return nil, common.NewCustomError(400, "input is nil", nil)
	}
	guestLists, err := gc.ConvertUploadGuestListsToDAO(&uploadValidationDto.UploadGuestLists)
	if err != nil {
		return nil, err
	}

	dao := &UploadValidation{
		UploadIssues:     uploadValidationDto.UploadIssues,
		UploadGuestLists: *guestLists,
	}
	return dao, nil
}

func (gc *GuestConverter) ConvertUploadValidationToDTO(raw *UploadValidation) (*UploadValidationDTO, *common.CustomError) {
	if raw == nil {
		return nil, common.NewCustomError(400, "input is nil", nil)
	}
	guestListsDTO, err := gc.ConvertUploadGuestListsToDTO(&raw.UploadGuestLists)
	if err != nil {
		return nil, err
	}

	dto := &UploadValidationDTO{
		UploadIssues:     raw.UploadIssues,
		UploadGuestLists: *guestListsDTO,
	}
	return dto, nil
}
