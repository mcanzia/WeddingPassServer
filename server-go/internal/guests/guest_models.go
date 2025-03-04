package guests

import (
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/transportation"
)

func CsvHeaders() []string {
	return []string{"Id", "Event Id", "Name", "Party Number", "Serial Number", "Events", "Email", "Accommodation", "Room Number", "Dietary Restrictions", "Drinks?", "Type of Drink", "Arrival Type", "Arr.Date", "Arr.Time", "Arr.Num", "Departure Type", "Dep.Date", "Dep.Time", "Dep.Num"}
}

func CsvFields() map[string]string {
	csvFields := make(map[string]string)
	csvFields["Id"] = "Id"
	csvFields["Event Id"] = "EventId"
	csvFields["Name"] = "Name"
	csvFields["Party Number"] = "GroupNumber"
	csvFields["Serial Number"] = "SerialNumber"
	csvFields["Events"] = "Events"
	csvFields["Email"] = "Email"
	csvFields["Accommodation"] = "Accommodation.Name"
	csvFields["Room Number"] = "Accommodation.RoomNumber"
	csvFields["Dietary Restrictions"] = "DietaryRestrictions"
	csvFields["Drinks?"] = "Drinks.WillDrinkAlcohol"
	csvFields["Type of Drink"] = "Drinks.Preferences"
	csvFields["Arrival Type"] = "Arrival.Type"
	csvFields["Arr.Date"] = "Arrival.Time"
	csvFields["Arr.Time"] = "Arrival.Time"
	csvFields["Arr.Num"] = "Arrival.Number"
	csvFields["Departure Type"] = "Departure.Type"
	csvFields["Dep.Date"] = "Departure.Time"
	csvFields["Dep.Time"] = "Departure.Time"
	csvFields["Dep.Num"] = "Departure.Number"

	return csvFields
}

type Guest struct {
	Id                  string                        `firestore:"id"`
	EventId             string                        `firestore:"eventId"`
	GroupNumber         int                           `firestore:"groupNumber"`
	Name                string                        `firestore:"name"`
	Email               string                        `firestore:"email"`
	Phone               string                        `firestore:"phone"`
	SubEvents           []string                      `firestore:"subEvents"`
	AttendingSubEvents  []string                      `firestore:"attendingSubEvents"`
	Arrival             transportation.Transportation `firestore:"arrival"`
	Departure           transportation.Transportation `firestore:"departure"`
	Drinks              drinks.Drinks                 `firestore:"drinks"`
	SerialNumber        string                        `firestore:"serialNumber"`
	DietaryRestrictions string                        `firestore:"dietaryRestrictions"`
	Accommodation       accommodation.Accommodation   `firestore:"accommodation"`
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
	Accommodation       accommodation.AccommodationDTO   `json:"accommodation"`
}

func NewGuestDTOInstance() *GuestDTO {
	return &GuestDTO{}
}

type UploadValidation struct {
	UploadIssues     map[string]string `firestore:"uploadIssues"`
	UploadGuestLists UploadGuestLists  `firestore:"uploadGuestLists"`
}

func NewUploadValidationInstance() *UploadValidation {
	return &UploadValidation{}
}

type UploadValidationDTO struct {
	UploadIssues     map[string]string   `json:"uploadIssues"`
	UploadGuestLists UploadGuestListsDTO `json:"uploadGuestLists"`
}

func NewUploadValidationDTOInstance() *UploadValidationDTO {
	return &UploadValidationDTO{}
}

type UploadGuestLists struct {
	CreateGuests []Guest `firestore:"createGuests"`
	UpdateGuests []Guest `firestore:"updateGuests"`
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
