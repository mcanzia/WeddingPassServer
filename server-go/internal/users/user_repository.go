package users

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type UserRepository interface {
	common.IBaseRepository[*User]
	GetUserByPhone(params map[string]string) (*User, error)
	GetUserByEmail(params map[string]string) (*User, error)
	GenerateInviteLink(eventRole EventRole) (*InviteToken, error)
	ProcessInvite(params map[string]string, inviteToken InviteToken) (*EventRole, error)
	AddUserToWedding(params map[string]string, eventRole EventRole) (*EventRole, error)
}

type userRepository struct {
	common.BaseRepository[*User]
}

func NewUserRepository(client *firestore.Client, ctx context.Context) UserRepository {
	coll := client.Collection("users")
	base := common.NewBaseRepository[*User](client, ctx, coll)
	return &userRepository{
		BaseRepository: base,
	}
}

func (repository *userRepository) GenerateInviteLink(eventRole EventRole) (*InviteToken, error) {
	panic("unimplemented")
}

func (repository *userRepository) GetUserByEmail(params map[string]string) (*User, error) {
	return repository.GetSingleByField(params)
}

func (repository *userRepository) GetUserByPhone(params map[string]string) (*User, error) {
	return repository.GetSingleByField(params)
}

// ProcessInvite implements UserRepository.
func (repository *userRepository) ProcessInvite(params map[string]string, inviteToken InviteToken) (*EventRole, error) {
	panic("unimplemented")
}

// AddUserToWedding implements UserRepository.
func (repository *userRepository) AddUserToWedding(params map[string]string, eventRole EventRole) (*EventRole, error) {
	panic("unimplemented")
}
