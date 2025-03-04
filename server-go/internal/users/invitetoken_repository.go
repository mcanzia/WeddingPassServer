package users

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type InviteTokenRepository interface {
	common.IBaseRepository[*InviteToken]
	FetchInvite(params map[string]string) (*InviteToken, *common.CustomError)
}

type inviteTokenRepository struct {
	common.BaseRepository[*InviteToken]
}

func NewInviteTokenRepository(client *firestore.Client, ctx context.Context) InviteTokenRepository {
	coll := client.Collection("inviteTokens")
	base := common.NewBaseRepository[*InviteToken](client, ctx, coll)
	return &inviteTokenRepository{
		BaseRepository: base,
	}
}

func (repository *inviteTokenRepository) FetchInvite(params map[string]string) (*InviteToken, *common.CustomError) {
	existingInviteToken, err := repository.BaseRepository.GetSingleByField(params)
	if err != nil {
		if err.Code == 201 {
			return nil, nil
		} else {
			return nil, err
		}
	}
	return existingInviteToken, nil
}
