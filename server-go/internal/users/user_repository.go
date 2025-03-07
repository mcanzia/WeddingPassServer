package users

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type UserRepository interface {
	common.IBaseRepository[*User]
	GetUserByPhone(params map[string]string) (*User, *common.CustomError)
	GetUserByEmail(params map[string]string) (*User, *common.CustomError)
	ProcessInvite(params map[string]string, inviteToken InviteToken) (*EventRole, *common.CustomError)
	AddUserToWedding(params map[string]string, eventRole EventRole) (*EventRole, *common.CustomError)
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

func (repository *userRepository) GetUserByEmail(params map[string]string) (*User, *common.CustomError) {
	return repository.GetSingleByField(params)
}

func (repository *userRepository) GetUserByPhone(params map[string]string) (*User, *common.CustomError) {
	return repository.GetSingleByField(params)
}

// ProcessInvite implements UserRepository.
func (repository *userRepository) ProcessInvite(params map[string]string, inviteToken InviteToken) (*EventRole, *common.CustomError) {
	panic("unimplemented")
}

// AddUserToWedding implements UserRepository.
func (repository *userRepository) AddUserToWedding(params map[string]string, eventRole EventRole) (*EventRole, *common.CustomError) {
	panic("unimplemented")
}
