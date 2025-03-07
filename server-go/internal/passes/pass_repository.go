package passes

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type PassRepository interface {
	common.IBaseRepository[*Pass]
}

type passRepository struct {
	common.BaseRepository[*Pass]
}

func NewPassRepository(client *firestore.Client, ctx context.Context) PassRepository {
	coll := client.Collection("passes")
	base := common.NewBaseRepository[*Pass](client, ctx, coll)
	return &passRepository{
		BaseRepository: base,
	}
}
