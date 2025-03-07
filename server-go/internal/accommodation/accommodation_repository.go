package accommodation

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type AccommodationRepository interface {
	common.IBaseRepository[*Accommodation]
}

type accommodationRepository struct {
	common.BaseRepository[*Accommodation]
}

func NewAccommodationRepository(client *firestore.Client, ctx context.Context) AccommodationRepository {
	coll := client.Collection("accommodations")
	base := common.NewBaseRepository[*Accommodation](client, ctx, coll)
	return &accommodationRepository{
		BaseRepository: base,
	}
}
