package events

import "time"

type Event struct {
	Id       string    `firestore:"id"`
	Name     string    `firestore:"name"`
	Date     time.Time `firestore:"date"`
	Location string    `firestore:"location"`
	OwnerId  string    `firestore:"ownerId"`
}

func NewEventInstance() *Event {
	return &Event{}
}

func (e *Event) SetID(id string) {
	e.Id = id
}

func (e *Event) GetID() string {
	return e.Id
}

type EventDTO struct {
	Id       string    `json:"id"`
	Name     string    `json:"name"`
	Date     time.Time `json:"date"`
	Location string    `json:"location"`
	OwnerId  string    `json:"ownerId"`
}

func NewEventDTOInstance() *EventDTO {
	return &EventDTO{}
}
