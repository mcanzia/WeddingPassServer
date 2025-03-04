package guests

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type GuestRepository interface {
	common.IBaseRepository[*Guest]
	FetchPartyMembers(params map[string]string) ([]*Guest, *common.CustomError)
	GetGuestByName(params map[string]string) (*Guest, *common.CustomError)
	GetGuestsByPhone(params map[string]string) ([]*Guest, *common.CustomError)
	GetGuestsByEmail(params map[string]string) ([]*Guest, *common.CustomError)
	GetGuestBySerialNumber(params map[string]string) (*Guest, *common.CustomError)
	GetGuestsForSubEvent(params map[string]string) ([]*Guest, *common.CustomError)
	GetGuestsByHotel(params map[string]string) ([]*Guest, *common.CustomError)
}

type guestRepository struct {
	common.BaseRepository[*Guest]
}

func NewGuestRepository(client *firestore.Client, ctx context.Context) GuestRepository {
	coll := client.Collection("guests")
	base := common.NewBaseRepository[*Guest](client, ctx, coll)
	return &guestRepository{
		BaseRepository: base,
	}
}

func (repository *guestRepository) FetchPartyMembers(params map[string]string) ([]*Guest, *common.CustomError) {
	currentGuest, err := repository.GetByID(params)
	if err != nil {
		return nil, err
	}
	eventId, ok := params["eventId"]
	if !ok {
		return nil, common.NewCustomError(400, "Event Id not provided for lookup", nil)
	}
	query := repository.Coll().Where("eventId", "==", eventId).Where("groupNumber", "==", currentGuest.GroupNumber)
	docs, fetchErr := query.Documents(repository.Ctx()).GetAll()
	if fetchErr != nil {
		return nil, common.NewCustomError(500, "Error fetching party members for guest", fetchErr)
	}

	if len(docs) == 0 {
		return []*Guest{}, nil
	}

	var partyMembers []*Guest
	for _, doc := range docs {
		guest, err := repository.TransformDocument(doc)
		if err != nil {
			return nil, err
		}
		partyMembers = append(partyMembers, guest)
	}
	return partyMembers, nil
}

func (repository *guestRepository) GetGuestByName(params map[string]string) (*Guest, *common.CustomError) {
	return repository.GetSingleByField(params)
}

func (repository *guestRepository) GetGuestsByPhone(params map[string]string) ([]*Guest, *common.CustomError) {
	return repository.GetMultiByField(params)
}

func (repository *guestRepository) GetGuestsByEmail(params map[string]string) ([]*Guest, *common.CustomError) {
	return repository.GetMultiByField(params)
}

func (repository *guestRepository) GetGuestBySerialNumber(params map[string]string) (*Guest, *common.CustomError) {
	return repository.GetSingleByField(params)
}

func (repository *guestRepository) GetGuestsForSubEvent(params map[string]string) ([]*Guest, *common.CustomError) {
	query := repository.Coll().Query
	eventId, ok := params["eventId"]
	if !ok || eventId == "" {
		return nil, common.NewCustomError(400, "GetGuestsForSubEvent: eventId not provided for lookup", nil)
	}
	subEventId, ok := params["subEventId"]
	if !ok || subEventId == "" {
		return nil, common.NewCustomError(400, "GetGuestsForSubEvent: subEventId not provided for lookup", nil)
	}
	query = query.Where("eventId", "==", eventId).Where("subEvents", "array-contains", subEventId)
	guests, err := repository.CustomGetAllQuery(query)
	if err != nil {
		return nil, err
	}
	return guests, nil
}

func (repository *guestRepository) GetGuestsByHotel(params map[string]string) ([]*Guest, *common.CustomError) {
	return repository.GetMultiByField(params)
}
