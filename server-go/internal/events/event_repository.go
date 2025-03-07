package events

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type EventRepository interface {
	common.IBaseRepository[*Event]
	GetEventsByOwner(params map[string]string) ([]*Event, error)
	GetEventByName(params map[string]string) (*Event, error)
}

type eventRepository struct {
	common.BaseRepository[*Event]
}

func NewEventRepository(client *firestore.Client, ctx context.Context) EventRepository {
	coll := client.Collection("events")
	base := common.NewBaseRepository[*Event](client, ctx, coll)
	return &eventRepository{
		BaseRepository: base,
	}
}

func (repository *eventRepository) GetEventsByOwner(params map[string]string) ([]*Event, error) {
	return repository.GetMultiByField(params)
}

func (repository *eventRepository) GetEventByName(params map[string]string) (*Event, error) {
	return repository.GetSingleByField(params)
}
