package users

import (
	"time"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/events"
	"weddingpass/server/internal/logger"

	"golang.org/x/exp/rand"
)

type UserService interface {
	common.IBaseService[*UserDTO]
	GetUserByPhone(params map[string]string) (*UserDTO, *common.CustomError)
	GetUserByEmail(params map[string]string) (*UserDTO, *common.CustomError)
	GenerateInviteLink(params map[string]string, eventRole *EventRoleDTO) (*InviteTokenDTO, *common.CustomError)
	ProcessInvite(params map[string]string, inviteToken *InviteTokenDTO) (*EventRoleDTO, *common.CustomError)
	AddUserToWedding(params map[string]string, eventRole *EventRoleDTO) (*EventRoleDTO, *common.CustomError)
}

type userService struct {
	common.BaseService[*User, *UserDTO]
	UserRepository        UserRepository
	InviteTokenRepository InviteTokenRepository
	Converter             *UserConverter
}

func NewUserService(repository UserRepository, inviteTokenRepository InviteTokenRepository, eventRepository events.EventRepository, eventConverter *events.EventConverter) UserService {
	converter := NewUserConverter(eventRepository, eventConverter)
	base := common.BaseService[*User, *UserDTO]{
		Repository: repository,
		ConvertToDAO: func(user *UserDTO) (*User, *common.CustomError) {
			return converter.ConvertUserToDAO(user)
		},
		ConvertToDTO: func(rawUser *User) (*UserDTO, *common.CustomError) {
			return converter.ConvertUserToDTO(rawUser)
		},
	}
	return &userService{
		BaseService:           base,
		UserRepository:        repository,
		InviteTokenRepository: inviteTokenRepository,
		Converter:             converter,
	}
}

func (s *userService) GetUserByPhone(params map[string]string) (*UserDTO, *common.CustomError) {
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

func (s *userService) GetUserByEmail(params map[string]string) (*UserDTO, *common.CustomError) {
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

func (s *userService) GenerateInviteLink(params map[string]string, eventRole *EventRoleDTO) (*InviteTokenDTO, *common.CustomError) {
	rawEventRole, err := s.Converter.ConvertEventRoleToDAO(eventRole)
	if err != nil {
		return nil, err
	}

	rand.Seed(uint64(time.Now().Unix()))

	var token string
	for {
		token = generateShortID()
		params["token"] = token
		existingInvite, err := s.InviteTokenRepository.FetchInvite(params)
		if err != nil {
			return nil, err
		}
		if existingInvite == nil {
			break
		}
	}

	inviteTokenToCreate := InviteToken{Token: token, EventRole: *rawEventRole}

	rawInviteToken, err := s.InviteTokenRepository.Save(params, &inviteTokenToCreate)
	if err != nil {
		return nil, err
	}

	inviteTokenDto, err := s.Converter.ConvertInviteTokenToDTO(rawInviteToken)
	if err != nil {
		return nil, err
	}
	return inviteTokenDto, nil
}

func generateShortID() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	const length = 8
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[rand.Intn(len(charset))]
	}
	return string(b)
}

func (s *userService) ProcessInvite(params map[string]string, inviteToken *InviteTokenDTO) (*EventRoleDTO, *common.CustomError) {
	params["token"] = inviteToken.Token
	rawInviteToken, err := s.InviteTokenRepository.FetchInvite(params)
	if err != nil {
		return nil, err
	}

	eventRoleDto, err := s.Converter.ConvertEventRoleToDTO(&rawInviteToken.EventRole)
	if err != nil {
		return nil, err
	}
	if eventRoleDto.Role != "guest" {
		params["id"] = rawInviteToken.Id
		err = s.InviteTokenRepository.Delete(params)
		if err != nil {
			logger.Global.Error("Error Deleting Invite Token: %s", rawInviteToken.Token)
		}
	}
	return eventRoleDto, nil
}

func (s *userService) AddUserToWedding(params map[string]string, eventRole *EventRoleDTO) (*EventRoleDTO, *common.CustomError) {
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
