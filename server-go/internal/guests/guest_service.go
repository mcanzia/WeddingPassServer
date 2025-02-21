package guests

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/transportation"
)

type GuestService interface {
	common.IBaseService[*GuestDTO]
	FetchPartyMembers(params map[string]string) ([]*GuestDTO, error)
	GetGuestByName(params map[string]string) (*GuestDTO, error)
	GetGuestsByPhone(params map[string]string) ([]*GuestDTO, error)
	GetGuestsByEmail(params map[string]string) ([]*GuestDTO, error)
	GetGuestBySerialNumber(params map[string]string) (*GuestDTO, error)
	GetGuestsForSubEvent(params map[string]string) ([]*GuestDTO, error)
	GetGuestsByHotel(params map[string]string) ([]*GuestDTO, error)
	UploadGuests(params map[string]string) (*UploadValidationDTO, error)
	DownloadGuests(params map[string]string) ([]*GuestDTO, error)
}

type guestService struct {
	common.BaseService[*Guest, *GuestDTO]
	GuestRepository GuestRepository
	Converter       *GuestConverter
}

func NewGuestService(repository GuestRepository,
	transportationConverter *transportation.TransportationConverter,
	subEventConverter *subevents.SubEventConverter,
	drinksConverter *drinks.DrinksConverter) GuestService {
	converter := NewGuestConverter(transportationConverter, subEventConverter, drinksConverter)
	base := common.BaseService[*Guest, *GuestDTO]{
		Repository: repository,
		ConvertToDAO: func(guest *GuestDTO) (*Guest, error) {
			return converter.ConvertGuestToDAO(guest)
		},
		ConvertToDTO: func(rawGuest *Guest) (*GuestDTO, error) {
			return converter.ConvertGuestToDTO(rawGuest)
		},
	}
	return &guestService{
		BaseService: base,
		Converter:   converter,
	}
}

func (s *guestService) FetchPartyMembers(params map[string]string) ([]*GuestDTO, error) {
	rawGuests, err := s.GuestRepository.FetchPartyMembers(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) GetGuestByName(params map[string]string) (*GuestDTO, error) {
	rawGuest, err := s.GuestRepository.GetGuestByName(params)
	if err != nil {
		return nil, err
	}
	guestDto, err := s.ConvertToDTO(rawGuest)
	if err != nil {
		return nil, err
	}
	return guestDto, nil
}

func (s *guestService) GetGuestsByPhone(params map[string]string) ([]*GuestDTO, error) {
	rawGuests, err := s.GuestRepository.GetGuestsByPhone(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil

}

func (s *guestService) GetGuestsByEmail(params map[string]string) ([]*GuestDTO, error) {
	rawGuests, err := s.GuestRepository.GetGuestsByEmail(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) GetGuestBySerialNumber(params map[string]string) (*GuestDTO, error) {
	rawGuest, err := s.GuestRepository.GetGuestBySerialNumber(params)
	if err != nil {
		return nil, err
	}
	guestDto, err := s.ConvertToDTO(rawGuest)
	if err != nil {
		return nil, err
	}
	return guestDto, nil
}

func (s *guestService) GetGuestsForSubEvent(params map[string]string) ([]*GuestDTO, error) {
	rawGuests, err := s.GuestRepository.GetGuestsForSubEvent(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) GetGuestsByHotel(params map[string]string) ([]*GuestDTO, error) {
	rawGuests, err := s.GuestRepository.GetGuestsByHotel(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) UploadGuests(params map[string]string) (*UploadValidationDTO, error) {
	rawUploadValidation, err := s.GuestRepository.UploadGuests(params)
	if err != nil {
		return nil, err
	}
	uploadValidationDto, err := s.Converter.ConvertUploadValidationToDTO(&rawUploadValidation)
	if err != nil {
		return nil, err
	}
	return uploadValidationDto, nil
}

func (s *guestService) DownloadGuests(params map[string]string) ([]*GuestDTO, error) {
	rawGuests, err := s.GuestRepository.DownloadGuests(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}
