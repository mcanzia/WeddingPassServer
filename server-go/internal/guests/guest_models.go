package guests

import (
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/transportation"
)

type Guest struct {
	Id                  string                        `json:"id"`
	EventId             string                        `json:"eventId"`
	GroupNumber         int                           `json:"groupNumber"`
	Name                string                        `json:"name"`
	Email               string                        `json:"email"`
	Phone               string                        `json:"phone"`
	SubEvents           []subevents.SubEvent          `json:"subEvents"`
	AttendingSubEvents  []subevents.SubEvent          `json:"attendingSubEvents"`
	Arrival             transportation.Transportation `json:"arrival"`
	Departure           transportation.Transportation `json:"departure"`
	Drinks              drinks.Drinks                 `json:"drinks"`
	SerialNumber        string                        `json:"serialNumber"`
	DietaryRestrictions string                        `json:"dietaryRestrictions"`
	Accommodation       accommodation.Accommodation   `json:"accommodation"`
}

func NewGuestInstance() *Guest {
	return &Guest{}
}

func (g *Guest) SetID(id string) {
	g.Id = id
}

func (g *Guest) GetID() string {
	return g.Id
}

type GuestDTO struct {
	Id                  string                           `json:"id"`
	EventId             string                           `json:"eventId"`
	GroupNumber         int                              `json:"groupNumber"`
	Name                string                           `json:"name"`
	Email               string                           `json:"email"`
	Phone               string                           `json:"phone"`
	SubEvents           []subevents.SubEventDTO          `json:"subEvents"`
	AttendingSubEvents  []subevents.SubEventDTO          `json:"attendingSubEvents"`
	Arrival             transportation.TransportationDTO `json:"arrival"`
	Departure           transportation.TransportationDTO `json:"departure"`
	Drinks              drinks.DrinksDTO                 `json:"drinks"`
	SerialNumber        string                           `json:"serialNumber"`
	DietaryRestrictions string                           `json:"dietaryRestrictions"`
	Accommodation       accommodation.Accommodation      `json:"accommodation"`
}

func NewGuestDTOInstance() *GuestDTO {
	return &GuestDTO{}
}

type PendingGuest struct {
	Id        string `json:"id"`
	UserId    string `json:"userId"`
	EventId   string `json:"eventId"`
	GuestName string `json:"guestName"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Status    string `json:"status"`
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

func (pg *PendingGuest) SetID(id string) {
	pg.Id = id
}

func (pg *PendingGuest) GetID() string {
	return pg.Id
}

type UploadValidation struct {
	UploadIssues     string           `json:"uploadIssues"`
	UploadGuestLists UploadGuestLists `json:"uploadGuestLists"`
}

func NewUploadValidationInstance() *UploadValidation {
	return &UploadValidation{}
}

type UploadValidationDTO struct {
	UploadIssues     string              `json:"uploadIssues"`
	UploadGuestLists UploadGuestListsDTO `json:"uploadGuestLists"`
}

func NewUploadValidationDTOInstance() *UploadValidationDTO {
	return &UploadValidationDTO{}
}

type UploadGuestLists struct {
	CreateGuests []Guest `json:"createGuests"`
	UpdateGuests []Guest `json:"updateGuests"`
}

func NewUploadGuestListsInstance() *UploadGuestLists {
	return &UploadGuestLists{}
}

type UploadGuestListsDTO struct {
	CreateGuests []GuestDTO `json:"createGuests"`
	UpdateGuests []GuestDTO `json:"updateGuests"`
}

func NewUploadGuestListsDTOInstance() *UploadGuestListsDTO {
	return &UploadGuestListsDTO{}
}
