package transportation

import "time"

type Transportation struct {
	Id        string    `json:"id"`
	Type      string    `json:"type"`
	IsArrival bool      `json:"isArrival"`
	Time      time.Time `json:"time"`
	Number    string    `json:"number"`
}

func NewTransportationInstance() *Transportation {
	return &Transportation{}
}

type TransportationDTO struct {
	Id        string    `json:"id"`
	Type      string    `json:"type"`
	IsArrival bool      `json:"isArrival"`
	Time      time.Time `json:"time"`
	Number    string    `json:"number"`
}

func NewTransportationDTOInstance() *TransportationDTO {
	return &TransportationDTO{}
}
