package guests

import (
	"context"
	"weddingpass/server/internal/common"

	"cloud.google.com/go/firestore"
)

type GuestRepository interface {
	common.IBaseRepository[*Guest]
	FetchPartyMembers(params map[string]string) ([]*Guest, error)
	GetGuestByName(params map[string]string) (*Guest, error)
	GetGuestsByPhone(params map[string]string) ([]*Guest, error)
	GetGuestsByEmail(params map[string]string) ([]*Guest, error)
	GetGuestBySerialNumber(params map[string]string) (*Guest, error)
	GetGuestsForSubEvent(params map[string]string) ([]*Guest, error)
	GetGuestsByHotel(params map[string]string) ([]*Guest, error)
	UploadGuests(params map[string]string) (UploadValidation, error)
	DownloadGuests(params map[string]string) ([]*Guest, error)
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

func (repository *guestRepository) FetchPartyMembers(params map[string]string) ([]*Guest, error) {
	return nil, nil
}

func (repository *guestRepository) GetGuestByName(params map[string]string) (*Guest, error) {
	return repository.GetSingleByField(params)
}

func (repository *guestRepository) GetGuestsByPhone(params map[string]string) ([]*Guest, error) {
	return repository.GetMultiByField(params)
}

func (repository *guestRepository) GetGuestsByEmail(params map[string]string) ([]*Guest, error) {
	return repository.GetMultiByField(params)
}

func (repository *guestRepository) GetGuestBySerialNumber(params map[string]string) (*Guest, error) {
	return repository.GetSingleByField(params)
}

func (repository *guestRepository) GetGuestsForSubEvent(params map[string]string) ([]*Guest, error) {
	return nil, nil
}

func (repository *guestRepository) GetGuestsByHotel(params map[string]string) ([]*Guest, error) {
	return repository.GetMultiByField(params)
}

func (repository *guestRepository) UploadGuests(params map[string]string) (UploadValidation, error) {
	return UploadValidation{}, nil
}

func (repository *guestRepository) DownloadGuests(params map[string]string) ([]*Guest, error) {
	return nil, nil
}
