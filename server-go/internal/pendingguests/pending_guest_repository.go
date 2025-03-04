package pendingguests

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type PendingGuestRepository interface {
	common.IBaseRepository[*PendingGuest]
}

type pendingGuestRepository struct {
	common.BaseRepository[*PendingGuest]
}

func NewPendingGuestRepository(client *firestore.Client, ctx context.Context) PendingGuestRepository {
	coll := client.Collection("pending-guests")
	base := common.NewBaseRepository[*PendingGuest](client, ctx, coll)
	return &pendingGuestRepository{
		BaseRepository: base,
	}
}
