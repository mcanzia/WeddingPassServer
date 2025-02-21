package guests

import (
	"fmt"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/transportation"
)

type GuestConverter struct {
	TransportationConverter *transportation.TransportationConverter
	SubEventConverter       *subevents.SubEventConverter
	DrinksConverter         *drinks.DrinksConverter
}

func NewGuestConverter(transportationConverter *transportation.TransportationConverter,
	subEventConverter *subevents.SubEventConverter,
	drinksConverter *drinks.DrinksConverter) *GuestConverter {
	return &GuestConverter{
		TransportationConverter: transportationConverter,
		SubEventConverter:       subEventConverter,
		DrinksConverter:         drinksConverter,
	}
}

func (gc *GuestConverter) ConvertGuestToDAO(guestDto *GuestDTO) (*Guest, error) {

	guest := &Guest{
		Id:                  guestDto.Id,
		EventId:             guestDto.EventId,
		GroupNumber:         guestDto.GroupNumber,
		Name:                guestDto.Name,
		Email:               guestDto.Email,
		Phone:               guestDto.Phone,
		SerialNumber:        guestDto.SerialNumber,
		DietaryRestrictions: guestDto.DietaryRestrictions,
		Accommodation:       guestDto.Accommodation,
	}

	for _, subEventDto := range guestDto.SubEvents {
		subEvent, err := gc.SubEventConverter.ConvertSubEventToDAO(&subEventDto)
		if err != nil {
			return nil, fmt.Errorf("ConvertGuestToDAO: failed to convert SubEvent: %w", err)
		}
		guest.SubEvents = append(guest.SubEvents, *subEvent)
	}

	for _, subEventDto := range guestDto.AttendingSubEvents {
		subEvent, err := gc.SubEventConverter.ConvertSubEventToDAO(&subEventDto)
		if err != nil {
			return nil, fmt.Errorf("ConvertGuestToDAO: failed to convert AttendingSubEvent: %w", err)
		}
		guest.AttendingSubEvents = append(guest.AttendingSubEvents, *subEvent)
	}

	arrival, err := gc.TransportationConverter.ConvertTransportationToDAO(&guestDto.Arrival)
	if err != nil {
		return nil, fmt.Errorf("ConvertGuestToDAO: failed to convert Arrival: %w", err)
	}
	guest.Arrival = *arrival

	departure, err := gc.TransportationConverter.ConvertTransportationToDAO(&guestDto.Departure)
	if err != nil {
		return nil, fmt.Errorf("ConvertGuestToDAO: failed to convert Departure: %w", err)
	}
	guest.Departure = *departure

	drinks, err := gc.DrinksConverter.ConvertDrinksToDAO(&guestDto.Drinks)
	if err != nil {
		return nil, fmt.Errorf("ConvertGuestToDAO: failed to convert Drinks: %w", err)
	}
	guest.Drinks = *drinks

	return guest, nil
}

func (gc *GuestConverter) ConvertGuestToDTO(raw *Guest) (*GuestDTO, error) {

	dto := &GuestDTO{
		Id:                  raw.Id,
		EventId:             raw.EventId,
		GroupNumber:         raw.GroupNumber,
		Name:                raw.Name,
		Email:               raw.Email,
		Phone:               raw.Phone,
		SerialNumber:        raw.SerialNumber,
		DietaryRestrictions: raw.DietaryRestrictions,
		Accommodation:       raw.Accommodation,
	}

	for _, se := range raw.SubEvents {
		seDTO, err := gc.SubEventConverter.ConvertSubEventToDTO(&se)
		if err != nil {
			return nil, fmt.Errorf("ConvertGuestToDTO: failed to convert SubEvent: %w", err)
		}
		dto.SubEvents = append(dto.SubEvents, *seDTO)
	}

	for _, se := range raw.AttendingSubEvents {
		seDTO, err := gc.SubEventConverter.ConvertSubEventToDTO(&se)
		if err != nil {
			return nil, fmt.Errorf("ConvertGuestToDTO: failed to convert AttendingSubEvent: %w", err)
		}
		dto.AttendingSubEvents = append(dto.AttendingSubEvents, *seDTO)
	}

	arrivalDTO, err := gc.TransportationConverter.ConvertTransportationToDTO(&raw.Arrival)
	if err != nil {
		return nil, fmt.Errorf("ConvertGuestToDTO: failed to convert Arrival: %w", err)
	}
	dto.Arrival = *arrivalDTO

	departureDTO, err := gc.TransportationConverter.ConvertTransportationToDTO(&raw.Departure)
	if err != nil {
		return nil, fmt.Errorf("ConvertGuestToDTO: failed to convert Departure: %w", err)
	}
	dto.Departure = *departureDTO

	drinksDTO, err := gc.DrinksConverter.ConvertDrinksToDTO(&raw.Drinks)
	if err != nil {
		return nil, fmt.Errorf("ConvertGuestToDTO: failed to convert Drinks: %w", err)
	}
	dto.Drinks = *drinksDTO

	return dto, nil
}

func (gc *GuestConverter) ConvertPendingGuestToDAO(pendingGuestDto *PendingGuestDTO) (*PendingGuest, error) {
	pendingGuest := &PendingGuest{
		Id:        pendingGuestDto.Id,
		UserId:    pendingGuestDto.UserId,
		EventId:   pendingGuestDto.EventId,
		GuestName: pendingGuestDto.GuestName,
		Email:     pendingGuestDto.Email,
		Phone:     pendingGuestDto.Phone,
		Status:    pendingGuestDto.Status,
	}
	return pendingGuest, nil
}

func (gc *GuestConverter) ConvertPendingGuestToDTO(raw *PendingGuest) (*PendingGuestDTO, error) {
	dto := &PendingGuestDTO{
		Id:        raw.Id,
		UserId:    raw.UserId,
		EventId:   raw.EventId,
		GuestName: raw.GuestName,
		Email:     raw.Email,
		Phone:     raw.Phone,
		Status:    raw.Status,
	}
	return dto, nil
}

func (gc *GuestConverter) ConvertUploadGuestListsToDAO(uploadGuestListsDto *UploadGuestListsDTO) (*UploadGuestLists, error) {
	uploadGuestLists := &UploadGuestLists{}

	for _, guestDto := range uploadGuestListsDto.CreateGuests {
		rawGuest, err := gc.ConvertGuestToDAO(&guestDto)
		if err != nil {
			return nil, fmt.Errorf("ConvertUploadGuestListsToDAO: failed to convert CreateGuest: %w", err)
		}
		uploadGuestLists.CreateGuests = append(uploadGuestLists.CreateGuests, *rawGuest)
	}

	for _, guestDto := range uploadGuestListsDto.UpdateGuests {
		rawGuest, err := gc.ConvertGuestToDAO(&guestDto)
		if err != nil {
			return nil, fmt.Errorf("ConvertUploadGuestListsToDAO: failed to convert UpdateGuest: %w", err)
		}
		uploadGuestLists.UpdateGuests = append(uploadGuestLists.UpdateGuests, *rawGuest)
	}

	return uploadGuestLists, nil
}

func (gc *GuestConverter) ConvertUploadGuestListsToDTO(raw *UploadGuestLists) (*UploadGuestListsDTO, error) {
	dto := &UploadGuestListsDTO{}

	for _, guest := range raw.CreateGuests {
		guestDTO, err := gc.ConvertGuestToDTO(&guest)
		if err != nil {
			return nil, fmt.Errorf("ConvertUploadGuestListsToDTO: failed to convert CreateGuest: %w", err)
		}
		dto.CreateGuests = append(dto.CreateGuests, *guestDTO)
	}

	for _, guest := range raw.UpdateGuests {
		guestDTO, err := gc.ConvertGuestToDTO(&guest)
		if err != nil {
			return nil, fmt.Errorf("ConvertUploadGuestListsToDTO: failed to convert UpdateGuest: %w", err)
		}
		dto.UpdateGuests = append(dto.UpdateGuests, *guestDTO)
	}

	return dto, nil
}

func (gc *GuestConverter) ConvertUploadValidationToDAO(uploadValidationDto *UploadValidationDTO) (*UploadValidation, error) {
	if uploadValidationDto == nil {
		return nil, fmt.Errorf("ConvertUploadValidationToDAO: input is nil")
	}
	guestLists, err := gc.ConvertUploadGuestListsToDAO(&uploadValidationDto.UploadGuestLists)
	if err != nil {
		return nil, fmt.Errorf("ConvertUploadValidationToDAO: failed to convert UploadGuestLists: %w", err)
	}

	dao := &UploadValidation{
		UploadIssues:     uploadValidationDto.UploadIssues,
		UploadGuestLists: *guestLists,
	}
	return dao, nil
}

func (gc *GuestConverter) ConvertUploadValidationToDTO(raw *UploadValidation) (*UploadValidationDTO, error) {
	if raw == nil {
		return nil, fmt.Errorf("ConvertUploadValidationToDTO: input is nil")
	}
	guestListsDTO, err := gc.ConvertUploadGuestListsToDTO(&raw.UploadGuestLists)
	if err != nil {
		return nil, fmt.Errorf("ConvertUploadValidationToDTO: failed to convert UploadGuestLists: %w", err)
	}

	dto := &UploadValidationDTO{
		UploadIssues:     raw.UploadIssues,
		UploadGuestLists: *guestListsDTO,
	}
	return dto, nil
}
