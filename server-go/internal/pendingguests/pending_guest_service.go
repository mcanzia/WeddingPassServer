package pendingguests

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/users"
)

type PendingGuestService interface {
	common.IBaseService[*PendingGuestDTO]
	LinkPendingGuest(params map[string]string, guestLink GuestLink) (*PendingGuestDTO, *common.CustomError)
}

type pendingGuestService struct {
	common.BaseService[*PendingGuest, *PendingGuestDTO]
	PendingGuestRepository PendingGuestRepository
	Converter              *PendingGuestConverter
	UserRepository         users.UserRepository
}

func NewPendingGuestService(repository PendingGuestRepository, userRepository users.UserRepository) PendingGuestService {
	converter := NewPendingGuestConverter()
	base := common.BaseService[*PendingGuest, *PendingGuestDTO]{
		Repository: repository,
		ConvertToDAO: func(guest *PendingGuestDTO) (*PendingGuest, *common.CustomError) {
			return converter.ConvertPendingGuestToDAO(guest)
		},
		ConvertToDTO: func(rawPendingGuest *PendingGuest) (*PendingGuestDTO, *common.CustomError) {
			return converter.ConvertPendingGuestToDTO(rawPendingGuest)
		},
	}
	return &pendingGuestService{
		BaseService:            base,
		PendingGuestRepository: repository,
		Converter:              converter,
		UserRepository:         userRepository,
	}
}

func (s *pendingGuestService) LinkPendingGuest(params map[string]string, guestLink GuestLink) (*PendingGuestDTO, *common.CustomError) {

	newEventRole := users.EventRole{
		Role:    "guest",
		GuestId: guestLink.Guest.Id,
		Event:   params["eventId"],
	}
	params["id"] = guestLink.PendingGuest.UserId
	delete(params, "eventId")
	existingUser, fetchUserErr := s.UserRepository.GetByID(params)
	if fetchUserErr != nil {
		return nil, fetchUserErr
	}

	existingUser.Phone = guestLink.PendingGuest.Phone
	existingUser.Email = guestLink.PendingGuest.Email
	existingUser.EventRoles = append(existingUser.EventRoles, newEventRole)

	_, saveErr := s.UserRepository.Save(params, existingUser)
	if saveErr != nil {
		return nil, saveErr
	}

	guestLink.PendingGuest.Status = "CONFIRMED"

	updatedPendingGuestDTO, saveErr := s.Save(params, &guestLink.PendingGuest)
	if saveErr != nil {
		return nil, saveErr
	}

	return updatedPendingGuestDTO, nil
}
