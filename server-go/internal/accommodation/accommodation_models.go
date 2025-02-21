package accommodation

type Accommodation interface {
	GetID() string
	GetEventId() string
	GetType() string
}

type BaseAccommodation struct {
	Id      string `json:"id"`
	EventId string `json:"eventId"`
	Type    string `json:"type"`
}

func NewBaseAccommodationInstance() *BaseAccommodation {
	return &BaseAccommodation{}
}

func (b BaseAccommodation) GetId() string {
	return b.Id
}

func (b BaseAccommodation) GetEventId() string {
	return b.EventId
}

func (b BaseAccommodation) GetType() string {
	return b.Type
}

type BaseAccommodationDTO struct {
	Id      string `json:"id"`
	EventId string `json:"eventId"`
	Type    string `json:"type"`
}

func NewBaseAccommodationDTOInstance() *BaseAccommodationDTO {
	return &BaseAccommodationDTO{}
}

func (b BaseAccommodationDTO) GetId() string {
	return b.Id
}

func (b BaseAccommodationDTO) GetEventId() string {
	return b.EventId
}

func (b BaseAccommodationDTO) GetType() string {
	return b.Type
}

type Hotel struct {
	BaseAccommodation
	RoomNumber string `json:"roomNumber"`
	Name       string `json:"name"`
	Location   string `json:"location"`
}

func NewHotelInstance() *Hotel {
	return &Hotel{}
}

func (h *Hotel) SetID(id string) {
	h.Id = id
}

func (h *Hotel) GetID() string {
	return h.Id
}

type HotelDTO struct {
	BaseAccommodationDTO
	RoomNumber string `json:"roomNumber"`
	Name       string `json:"name"`
	Location   string `json:"location"`
}

func NewHotelDTOInstance() *HotelDTO {
	return &HotelDTO{}
}
