package subevents

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type SubEventRepository interface {
	common.IBaseRepository[*SubEvent]
	GetSubEventByName(params map[string]string) (*SubEvent, *common.CustomError)
}

type subEventRepository struct {
	common.BaseRepository[*SubEvent]
}

func NewSubEventRepository(client *firestore.Client, ctx context.Context) SubEventRepository {
	coll := client.Collection("subevents")
	base := common.NewBaseRepository[*SubEvent](client, ctx, coll)
	return &subEventRepository{
		BaseRepository: base,
	}
}

func (dao *subEventRepository) GetSubEventByName(params map[string]string) (*SubEvent, *common.CustomError) {
	return dao.GetSingleByField(params)
}
