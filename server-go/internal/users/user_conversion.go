package users

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/events"
)

type UserConverter struct {
	EventRepo      events.EventRepository
	EventConverter *events.EventConverter
}

func NewUserConverter(repo events.EventRepository, eventConverter *events.EventConverter) *UserConverter {
	return &UserConverter{
		EventRepo:      repo,
		EventConverter: eventConverter,
	}
}

func (uc *UserConverter) ConvertUserToDAO(userDTO *UserDTO) (*User, error) {
	user := &User{
		Id:    userDTO.Id,
		Email: userDTO.Email,
		Phone: userDTO.Phone,
	}

	for _, role := range userDTO.EventRoles {

		daoRole, err := uc.ConvertEventRoleToDAO(&role)
		if err != nil {
			return nil, err
		}
		user.EventRoles = append(user.EventRoles, *daoRole)
	}
	return user, nil
}

func (uc *UserConverter) ConvertUserToDTO(rawUser *User) (*UserDTO, error) {
	dto := &UserDTO{
		Id:    rawUser.Id,
		Email: rawUser.Email,
		Phone: rawUser.Phone,
	}

	for _, role := range rawUser.EventRoles {

		dtoRole, err := uc.ConvertEventRoleToDTO(&role)
		if err != nil {
			return nil, err
		}
		dto.EventRoles = append(dto.EventRoles, *dtoRole)
	}
	return dto, nil
}

func (uc *UserConverter) ConvertEventRoleToDAO(eventRoleDTO *EventRoleDTO) (*EventRole, error) {
	eventRole := &EventRole{
		Role:    eventRoleDTO.Role,
		GuestId: eventRoleDTO.GuestId,
		Event:   eventRoleDTO.Event.Id,
	}

	return eventRole, nil
}

func (uc *UserConverter) ConvertEventRoleToDTO(rawEventRole *EventRole) (*EventRoleDTO, error) {
	eventParams := map[string]string{"id": rawEventRole.Event}
	rawEvent, err := uc.EventRepo.GetByID(eventParams)
	if err != nil {
		return nil, common.NewCustomError(500, "convert event role: failed to lookup event for role", err)
	}
	eventDTO, err := uc.EventConverter.ConvertEventToDTO(rawEvent)
	if err != nil {
		return nil, common.NewCustomError(500, "convert event role: failed to convert event", err)
	}

	dtoEventRole := EventRoleDTO{
		Role:    rawEventRole.Role,
		Event:   *eventDTO,
		GuestId: rawEventRole.GuestId,
	}
	return &dtoEventRole, nil
}

func (uc *UserConverter) ConvertInviteTokenToDAO(inviteTokenDTO *InviteTokenDTO) (*InviteToken, error) {

	eventRole, err := uc.ConvertEventRoleToDAO(&inviteTokenDTO.EventRole)
	if err != nil {
		return nil, err
	}

	inviteToken := &InviteToken{
		Token:     inviteTokenDTO.Token,
		EventRole: *eventRole,
		GuestId:   inviteTokenDTO.GuestId,
	}

	return inviteToken, nil
}

func (uc *UserConverter) ConvertInviteTokenToDTO(rawInviteToken *InviteToken) (*InviteTokenDTO, error) {
	eventRoleDTO, err := uc.ConvertEventRoleToDTO(&rawInviteToken.EventRole)
	if err != nil {
		return nil, err
	}

	inviteTokenDTO := &InviteTokenDTO{
		Token:     rawInviteToken.Token,
		EventRole: *eventRoleDTO,
		GuestId:   rawInviteToken.GuestId,
	}

	return inviteTokenDTO, nil
}
