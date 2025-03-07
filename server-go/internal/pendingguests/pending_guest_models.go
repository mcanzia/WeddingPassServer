package pendingguests

import "weddingpass/server/internal/guests"

type PendingGuest struct {
	Id        string `firestore:"id"`
	UserId    string `firestore:"userId"`
	EventId   string `firestore:"eventId"`
	GuestName string `firestore:"guestName"`
	Email     string `firestore:"email"`
	Phone     string `firestore:"phone"`
	Status    string `firestore:"status"`
}

func (pg *PendingGuest) SetID(id string) {
	pg.Id = id
}

func (pg *PendingGuest) GetID() string {
	return pg.Id
}

func NewPendingGuestInstance() *PendingGuest {
	return &PendingGuest{}
}

type PendingGuestDTO struct {
	Id        string `json:"id"`
	UserId    string `json:"userId"`
	EventId   string `json:"eventId"`
	GuestName string `json:"guestName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Status    string `json:"status"`
}

func NewPendingGuestDTOInstance() *PendingGuestDTO {
	return &PendingGuestDTO{}
}

type GuestLink struct {
	PendingGuest PendingGuestDTO `json:"pendingGuest"`
	Guest        guests.GuestDTO `json:"guest"`
}
