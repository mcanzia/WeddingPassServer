package users

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/events"
)

type UserService interface {
	common.IBaseService[*UserDTO]
	GetUserByPhone(params map[string]string) (*UserDTO, error)
	GetUserByEmail(params map[string]string) (*UserDTO, error)
	GenerateInviteLink(eventRole *EventRoleDTO) (*InviteTokenDTO, error)
	ProcessInvite(params map[string]string, inviteToken *InviteTokenDTO) (*EventRoleDTO, error)
	AddUserToWedding(params map[string]string, eventRole *EventRoleDTO) (*EventRoleDTO, error)
}

type userService struct {
	common.BaseService[*User, *UserDTO]
	UserRepository UserRepository
	Converter      *UserConverter
}

func NewUserService(repository UserRepository, eventRepository events.EventRepository, eventConverter *events.EventConverter) UserService {
	converter := NewUserConverter(eventRepository, eventConverter)
	base := common.BaseService[*User, *UserDTO]{
		Repository: repository,
		ConvertToDAO: func(user *UserDTO) (*User, error) {
			return converter.ConvertUserToDAO(user)
		},
		ConvertToDTO: func(rawUser *User) (*UserDTO, error) {
			return converter.ConvertUserToDTO(rawUser)
		},
	}
	return &userService{
		BaseService: base,
		Converter:   converter,
	}
}

func (s *userService) GetUserByPhone(params map[string]string) (*UserDTO, error) {
	rawUser, err := s.UserRepository.GetUserByPhone(params)
	if err != nil {
		return nil, err
	}
	userDto, err := s.ConvertToDTO(rawUser)
	if err != nil {
		return nil, err
	}
	return userDto, nil
}

func (s *userService) GetUserByEmail(params map[string]string) (*UserDTO, error) {
	rawUser, err := s.UserRepository.GetUserByEmail(params)
	if err != nil {
		return nil, err
	}
	userDto, err := s.ConvertToDTO(rawUser)
	if err != nil {
		return nil, err
	}
	return userDto, nil
}

func (s *userService) GenerateInviteLink(eventRole *EventRoleDTO) (*InviteTokenDTO, error) {
	rawEventRole, err := s.Converter.ConvertEventRoleToDAO(eventRole)
	if err != nil {
		return nil, err
	}
	rawInviteToken, err := s.UserRepository.GenerateInviteLink(*rawEventRole)
	if err != nil {
		return nil, err
	}

	inviteTokenDto, err := s.Converter.ConvertInviteTokenToDTO(rawInviteToken)
	if err != nil {
		return nil, err
	}
	return inviteTokenDto, nil
}

func (s *userService) ProcessInvite(params map[string]string, inviteToken *InviteTokenDTO) (*EventRoleDTO, error) {
	rawInviteToken, err := s.Converter.ConvertInviteTokenToDAO(inviteToken)
	if err != nil {
		return nil, err
	}
	rawEventRole, err := s.UserRepository.ProcessInvite(params, *rawInviteToken)
	if err != nil {
		return nil, err
	}

	eventRoleDto, err := s.Converter.ConvertEventRoleToDTO(rawEventRole)
	if err != nil {
		return nil, err
	}
	return eventRoleDto, nil
}

func (s *userService) AddUserToWedding(params map[string]string, eventRole *EventRoleDTO) (*EventRoleDTO, error) {
	rawEventRole, err := s.Converter.ConvertEventRoleToDAO(eventRole)
	if err != nil {
		return nil, err
	}
	addedEventRole, err := s.UserRepository.AddUserToWedding(params, *rawEventRole)
	if err != nil {
		return nil, err
	}

	eventRoleDto, err := s.Converter.ConvertEventRoleToDTO(addedEventRole)
	if err != nil {
		return nil, err
	}
	return eventRoleDto, nil
}
