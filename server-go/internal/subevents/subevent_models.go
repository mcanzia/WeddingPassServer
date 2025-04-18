package subevents

type SubEvent struct {
	Id      string `firestore:"id"`
	EventId string `firestore:"eventId"`
	Name    string `firestore:"name"`
	Order   int    `firestore:"order"`
}

func NewSubEventInstance() *SubEvent {
	return &SubEvent{}
}

func (se *SubEvent) SetID(id string) {
	se.Id = id
}

func (se *SubEvent) GetID() string {
	return se.Id
}

type SubEventDTO struct {
	Id      string `json:"id"`
	EventId string `json:"eventId"`
	Name    string `json:"name"`
	Order   int    `json:"order"`
}

func NewSubEventDTOInstance() *SubEventDTO {
	return &SubEventDTO{}
}
