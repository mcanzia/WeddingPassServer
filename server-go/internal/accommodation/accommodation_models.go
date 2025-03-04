package accommodation

type Accommodation struct {
	Id         string `firestore:"id"`
	EventId    string `firestore:"eventId"`
	Type       string `firestore:"type"`
	RoomNumber string `firestore:"roomNumber"`
	Name       string `firestore:"name"`
	Location   string `firestore:"location"`
}

func NewAccommodationInstance() *Accommodation {
	return &Accommodation{}
}

func (a *Accommodation) SetID(id string) {
	a.Id = id
}

func (a *Accommodation) GetID() string {
	return a.Id
}

type AccommodationDTO struct {
	Id         string `json:"id"`
	EventId    string `json:"eventId"`
	Type       string `json:"type"`
	RoomNumber string `json:"roomNumber"`
	Name       string `json:"name"`
	Location   string `json:"location"`
}

func NewAccommodationDTOInstance() *AccommodationDTO {
	return &AccommodationDTO{}
}
