package accommodation

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type HotelRepository interface {
	common.IBaseRepository[*Hotel]
}

type hotelRepository struct {
	common.BaseRepository[*Hotel]
}

func NewHotelRepository(client *firestore.Client, ctx context.Context) HotelRepository {
	coll := client.Collection("hotels")
	base := common.NewBaseRepository[*Hotel](client, ctx, coll)
	return &hotelRepository{
		BaseRepository: base,
	}
}
