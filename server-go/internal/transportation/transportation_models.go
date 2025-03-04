package transportation

type Transportation struct {
	Type      string `firestore:"type"`
	IsArrival bool   `firestore:"isArrival"`
	Time      string `firestore:"time"`
	Number    string `firestore:"number"`
}

func NewTransportationInstance() *Transportation {
	return &Transportation{}
}

type TransportationDTO struct {
	Type      string `json:"type"`
	IsArrival bool   `json:"isArrival"`
	Time      string `json:"time"`
	Number    string `json:"number"`
}

func NewTransportationDTOInstance() *TransportationDTO {
	return &TransportationDTO{}
}
