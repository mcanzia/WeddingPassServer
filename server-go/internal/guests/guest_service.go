package guests

import (
	"encoding/csv"
	"fmt"
	"io"
	"mime/multipart"
	"regexp"
	"strconv"
	"strings"
	"time"
	"weddingpass/server/internal/accommodation"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/drinks"
	"weddingpass/server/internal/logger"
	"weddingpass/server/internal/subevents"
	"weddingpass/server/internal/transportation"

	"github.com/xuri/excelize/v2"
)

type GuestService interface {
	common.IBaseService[*GuestDTO]
	FetchPartyMembers(params map[string]string) ([]*GuestDTO, *common.CustomError)
	GetGuestByName(params map[string]string) (*GuestDTO, *common.CustomError)
	GetGuestsByPhone(params map[string]string) ([]*GuestDTO, *common.CustomError)
	GetGuestsByEmail(params map[string]string) ([]*GuestDTO, *common.CustomError)
	GetGuestBySerialNumber(params map[string]string) (*GuestDTO, *common.CustomError)
	GetGuestsForSubEvent(params map[string]string) ([]*GuestDTO, *common.CustomError)
	GetGuestsByHotel(params map[string]string) ([]*GuestDTO, *common.CustomError)
	ValidateGuests(params map[string]string, guestLists *UploadGuestListsDTO) (*UploadValidationDTO, *common.CustomError)
	UploadGuests(params map[string]string, file multipart.File, ext string) (*UploadGuestListsDTO, *common.CustomError)
	GenerateCSVContent(params map[string]string) (string, *common.CustomError)
}

type guestService struct {
	common.BaseService[*Guest, *GuestDTO]
	GuestRepository      GuestRepository
	SubEventService      subevents.SubEventService
	AccommodationService accommodation.AccommodationService
	Converter            *GuestConverter
}

func NewGuestService(repository GuestRepository,
	transportationConverter *transportation.TransportationConverter,
	subEventConverter *subevents.SubEventConverter,
	subEventService subevents.SubEventService,
	drinksConverter *drinks.DrinksConverter,
	accommodationConverter *accommodation.AccommodationConverter,
	accommodationService accommodation.AccommodationService) GuestService {
	converter := NewGuestConverter(transportationConverter, subEventConverter, subEventService, drinksConverter, accommodationConverter)
	base := common.BaseService[*Guest, *GuestDTO]{
		Repository: repository,
		ConvertToDAO: func(guest *GuestDTO) (*Guest, *common.CustomError) {
			return converter.ConvertGuestToDAO(guest)
		},
		ConvertToDTO: func(rawGuest *Guest) (*GuestDTO, *common.CustomError) {
			return converter.ConvertGuestToDTO(rawGuest)
		},
	}
	return &guestService{
		BaseService:          base,
		GuestRepository:      repository,
		SubEventService:      subEventService,
		AccommodationService: accommodationService,
		Converter:            converter,
	}
}

func (s *guestService) FetchPartyMembers(params map[string]string) ([]*GuestDTO, *common.CustomError) {
	rawGuests, err := s.GuestRepository.FetchPartyMembers(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) GetGuestByName(params map[string]string) (*GuestDTO, *common.CustomError) {
	rawGuest, err := s.GuestRepository.GetGuestByName(params)
	if err != nil {
		return nil, err
	}
	guestDto, err := s.ConvertToDTO(rawGuest)
	if err != nil {
		return nil, err
	}
	return guestDto, nil
}

func (s *guestService) GetGuestsByPhone(params map[string]string) ([]*GuestDTO, *common.CustomError) {
	rawGuests, err := s.GuestRepository.GetGuestsByPhone(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil

}

func (s *guestService) GetGuestsByEmail(params map[string]string) ([]*GuestDTO, *common.CustomError) {
	rawGuests, err := s.GuestRepository.GetGuestsByEmail(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) GetGuestBySerialNumber(params map[string]string) (*GuestDTO, *common.CustomError) {
	rawGuest, err := s.GuestRepository.GetGuestBySerialNumber(params)
	if err != nil {
		return nil, err
	}
	guestDto, err := s.ConvertToDTO(rawGuest)
	if err != nil {
		return nil, err
	}
	return guestDto, nil
}

func (s *guestService) GetGuestsForSubEvent(params map[string]string) ([]*GuestDTO, *common.CustomError) {
	rawGuests, err := s.GuestRepository.GetGuestsForSubEvent(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) GetGuestsByHotel(params map[string]string) ([]*GuestDTO, *common.CustomError) {
	rawGuests, err := s.GuestRepository.GetGuestsByHotel(params)
	if err != nil {
		return nil, err
	}
	guestDtos, err := s.ConvertAllToDTO(rawGuests)
	if err != nil {
		return nil, err
	}
	return guestDtos, nil
}

func (s *guestService) ValidateGuests(params map[string]string, guestLists *UploadGuestListsDTO) (*UploadValidationDTO, *common.CustomError) {
	existingGuests, err := s.GetAll(params)
	if err != nil {
		return nil, err
	}
	var existingGuestNames []string
	for _, existingGuest := range existingGuests {
		existingGuestNames = append(existingGuestNames, strings.ToLower(existingGuest.Name))
	}
	var uploadIssues = make(map[string]string)
	var validatedCreateGuests, validatedUpdateGuests []GuestDTO

	for index, createGuest := range guestLists.CreateGuests {
		validationError := validateGuest(createGuest, existingGuestNames, false)
		if validationError != "" {
			name := createGuest.Name
			if name == "" {
				name = fmt.Sprintf("Unknown %d", index)
			}
			uploadIssues[name] = validationError
		} else {
			validatedCreateGuests = append(validatedCreateGuests, createGuest)
		}
	}

	for index, updatedGuest := range guestLists.UpdateGuests {
		validationError := validateGuest(updatedGuest, existingGuestNames, true)
		if validationError != "" {
			name := updatedGuest.Name
			if name == "" {
				name = fmt.Sprintf("Unknown %d", index)
			}
			uploadIssues[name] = validationError
		} else {
			validatedUpdateGuests = append(validatedUpdateGuests, updatedGuest)
		}
	}

	uploadGuestLists := UploadGuestListsDTO{
		CreateGuests: validatedCreateGuests,
		UpdateGuests: validatedUpdateGuests,
	}
	return &UploadValidationDTO{UploadIssues: uploadIssues, UploadGuestLists: uploadGuestLists}, nil
}

func validateGuest(guest GuestDTO, existingGuestNames []string, isUpdate bool) string {
	if guest.Name == "" {
		return NameMissing
	}

	if guest.GroupNumber == -1 {
		return PartyNumberMissing
	}

	if !isUpdate && common.ArrayContains(existingGuestNames, strings.ToLower(guest.Name)) {
		return DuplicateGuest
	}

	if len(guest.Name) > 100 {
		return NameTooLong
	}

	if guest.Email != "" && len(guest.Email) > 50 {
		return EmailTooLong
	}

	if guest.Phone != "" && len(guest.Phone) > 50 {
		return PhoneTooLong
	}

	return ""
}

func (s *guestService) GenerateCSVContent(params map[string]string) (string, *common.CustomError) {
	guestDtos, err := s.GetAll(params)
	if err != nil {
		return "", err
	}
	var csvBuilder strings.Builder
	writer := csv.NewWriter(&csvBuilder)

	headers := CsvHeaders()
	if err := writer.Write(headers); err != nil {
		return "", common.NewCustomError(500, "Error writing headers to csv file", err)
	}

	for _, guestDto := range guestDtos {
		row := []string{
			guestDto.Id,
			guestDto.EventId,
			guestDto.Name,
			fmt.Sprint(guestDto.GroupNumber),
			guestDto.SerialNumber,
		}
		//SubEvents
		var subEventNames []string
		for _, subevent := range guestDto.SubEvents {
			subEventNames = append(subEventNames, subevent.Name)
		}
		row = append(row, strings.Join(subEventNames, ", "))
		//Email
		row = append(row, guestDto.Email)
		//Accommodation
		row = append(row, guestDto.Accommodation.Name)
		row = append(row, guestDto.Accommodation.RoomNumber)
		//Dietary Restrictions
		row = append(row, guestDto.DietaryRestrictions)
		//Drinks
		row = append(row, fmt.Sprint(guestDto.Drinks.WillDrinkAlcohol))
		row = append(row, strings.Join(guestDto.Drinks.Preferences, ", "))
		//Arrival
		row = append(row, guestDto.Arrival.Type)
		arrivalDateTime := getDateTime(guestDto.Arrival.Time)
		row = append(row, arrivalDateTime[0])
		row = append(row, arrivalDateTime[1])
		row = append(row, guestDto.Arrival.Number)
		//Departure
		row = append(row, guestDto.Departure.Type)
		departureDateTime := getDateTime(guestDto.Departure.Time)
		row = append(row, departureDateTime[0])
		row = append(row, departureDateTime[1])
		row = append(row, guestDto.Departure.Number)
		if err := writer.Write(row); err != nil {
			return "", common.NewCustomError(500, "Error writing rows to csv file", err)
		}
	}
	writer.Flush()
	if err := writer.Error(); err != nil {
		return "", common.NewCustomError(500, "Error flushing csv file", err)
	}
	return csvBuilder.String(), nil
}

func getDateTime(dateTime string) []string {
	if dateTime == "" {
		return []string{"", ""}
	}
	var dateTimeSplit = strings.Split(dateTime, "T")

	dateLayout := "2006-01-02"

	parsedTime, err := time.Parse(dateLayout, dateTimeSplit[0])
	if err != nil {
		dateTimeSplit[0] = "ERROR"
		return dateTimeSplit
	}

	dateTimeSplit[0] = parsedTime.Format("01/02/2006")

	return dateTimeSplit

}

func (s *guestService) UploadGuests(params map[string]string, file multipart.File, ext string) (*UploadGuestListsDTO, *common.CustomError) {
	eventId, ok := params["eventId"]
	if !ok || eventId == "" {
		return nil, common.NewCustomError(400, "Event ID not provided", nil)
	}

	subevents, err := s.SubEventService.GetAll(params)
	if err != nil {
		return nil, err
	}
	accommodations, err := s.AccommodationService.GetAll(params)
	if err != nil {
		return nil, err
	}

	var uploadGuestLists *UploadGuestListsDTO
	switch ext {
	case ".csv":
		uploadGuestLists, err = parseCSV(file, eventId, subevents, accommodations)
		if err != nil {
			return nil, err
		}
	case ".xlsx":
		uploadGuestLists, err = parseXLSX(file, eventId, subevents, accommodations)
		if err != nil {
			return nil, err
		}
	default:
		return nil, common.NewCustomError(400, "Unsupported file type", nil)
	}

	return uploadGuestLists, nil
}

func parseCSV(r io.Reader, eventId string, subEvents []*subevents.SubEventDTO, accommodations []*accommodation.AccommodationDTO) (*UploadGuestListsDTO, *common.CustomError) {
	reader := csv.NewReader(r)
	headers, err := reader.Read()
	if err != nil {
		return nil, common.NewCustomError(500, "Failed to read csv header", nil)
	}
	headerMap := make(map[string]int)
	for i, h := range headers {
		headerMap[h] = i
	}

	var createGuests, updateGuests []GuestDTO

	for {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, common.NewCustomError(500, "Failed to read csv record", nil)
		}

		rowData := make(map[string]string)
		for key, idx := range headerMap {
			if idx < len(record) {
				rowData[key] = record[idx]
			}
		}

		if id, ok := rowData["Id"]; ok && id != "" {
			guest, err := updateGuestFromData(rowData, eventId, subEvents, accommodations)
			if err != nil {
				return nil, err
			}
			updateGuests = append(updateGuests, guest)
		} else {
			guest, err := createGuestFromData(rowData, eventId, subEvents, accommodations)
			if err != nil {
				return nil, err
			}
			createGuests = append(createGuests, guest)
		}
	}

	return &UploadGuestListsDTO{
		CreateGuests: createGuests,
		UpdateGuests: updateGuests,
	}, nil
}

func parseXLSX(r io.Reader, eventId string, subEvents []*subevents.SubEventDTO, accommodations []*accommodation.AccommodationDTO) (*UploadGuestListsDTO, *common.CustomError) {
	dataBytes, err := io.ReadAll(r)
	if err != nil {
		return nil, common.NewCustomError(500, "Failed to read XLSX file", err)
	}

	f, err := excelize.OpenReader(strings.NewReader(string(dataBytes)))
	if err != nil {
		return nil, common.NewCustomError(500, "Failed to open XLSX file", err)
	}
	defer f.Close()

	sheetName := f.GetSheetName(0)
	if sheetName == "" {
		return nil, common.NewCustomError(500, "No sheet found in the XLSX file", nil)
	}

	rows, err := f.GetRows(sheetName)
	if err != nil {
		return nil, common.NewCustomError(500, "Failed to read rows from XLSX", err)
	}

	if len(rows) < 2 {
		return nil, common.NewCustomError(400, "XLSX file does not contain enough rows", nil)
	}

	headerMap := make(map[string]int)
	headers := rows[0]
	for i, h := range headers {
		headerMap[h] = i
	}

	var createGuests, updateGuests []GuestDTO

	for _, record := range rows[1:] {
		rowData := make(map[string]string)

		for key, idx := range headerMap {
			if idx < len(record) {
				rowData[key] = record[idx]
			}
		}

		if id, ok := rowData["Id"]; ok && id != "" {
			guest, err := updateGuestFromData(rowData, eventId, subEvents, accommodations)
			if err != nil {
				return nil, err
			}
			updateGuests = append(updateGuests, guest)
		} else {
			guest, err := createGuestFromData(rowData, eventId, subEvents, accommodations)
			if err != nil {
				return nil, err
			}
			createGuests = append(createGuests, guest)
		}
	}

	return &UploadGuestListsDTO{
		CreateGuests: createGuests,
		UpdateGuests: updateGuests,
	}, nil
}

func createGuestFromData(data map[string]string, eventId string, allSubEvents []*subevents.SubEventDTO, allAccommodations []*accommodation.AccommodationDTO) (GuestDTO, *common.CustomError) {
	createdGuest := GuestDTO{
		EventId:             eventId,
		Name:                parseStringField(data["Name"]),
		Email:               parseStringField(data["Email"]),
		Phone:               cleanPhoneField(data["Phone"]),
		SerialNumber:        parseStringField(data["Serial Number"]),
		DietaryRestrictions: parseStringField(data["Dietary Restrictions"]),
	}

	setGuestFields(data, &createdGuest, allSubEvents, allAccommodations)

	return createdGuest, nil
}

func updateGuestFromData(data map[string]string, eventId string, allSubEvents []*subevents.SubEventDTO, allAccommodations []*accommodation.AccommodationDTO) (GuestDTO, *common.CustomError) {
	updatedGuest := GuestDTO{
		Id:                  parseStringField(data["Id"]),
		EventId:             eventId,
		Name:                parseStringField(data["Name"]),
		Email:               parseStringField(data["Email"]),
		Phone:               cleanPhoneField(data["Phone"]),
		SerialNumber:        parseStringField(data["Serial Number"]),
		DietaryRestrictions: parseStringField(data["Dietary Restrictions"]),
	}

	setGuestFields(data, &updatedGuest, allSubEvents, allAccommodations)

	return updatedGuest, nil
}

func setGuestFields(data map[string]string, guest *GuestDTO, allSubEvents []*subevents.SubEventDTO, allAccommodations []*accommodation.AccommodationDTO) *common.CustomError {
	// Group Number
	groupNumber, err := strconv.Atoi(parseStringField(data["Party Number"]))
	if err != nil {
		logger.Global.Error("Error converting Group Number to integer: %w", err)
	}
	guest.GroupNumber = groupNumber

	// Sub Events
	guest.SubEvents = parseSubEvents(data, allSubEvents)

	// Arrival Transportation
	guest.Arrival = parseTransportation(data, true)

	// Departure Transportation
	guest.Departure = parseTransportation(data, false)

	// Accommodation
	guest.Accommodation = parseAccommodation(data, allAccommodations)

	// Drinks
	guest.Drinks = parseDrinks(data)

	return nil
}

func parseStringField(input string) string {
	if input == "" {
		return ""
	}
	return strings.TrimSpace(input)
}

func cleanPhoneField(phone string) string {
	if phone == "" {
		return ""
	}
	trimmed := strings.TrimSpace(phone)
	re := regexp.MustCompile(`[^\d+]`)

	cleaned := re.ReplaceAllString(trimmed, "")

	if strings.Index(cleaned, "+") > 0 {
		cleaned = strings.ReplaceAll(cleaned, "+", "")
	}
	return cleaned
}

func parseSubEvents(data map[string]string, allSubEvents []*subevents.SubEventDTO) []subevents.SubEventDTO {
	var guestSubEvents []subevents.SubEventDTO

	for _, subEvent := range allSubEvents {
		invitedStatus := strings.ToLower(parseStringField(data[subEvent.Name]))
		if invitedStatus != "" && common.ArrayContains([]string{"yes", "done", "y", "true"}, invitedStatus) {
			guestSubEvents = append(guestSubEvents, *subEvent)
		}
	}
	return guestSubEvents

}

func parseTransportation(data map[string]string, isArrival bool) transportation.TransportationDTO {

	var transportation transportation.TransportationDTO

	var prefix string
	if isArrival {
		transportation.IsArrival = true
		prefix = "Arr"
		transportation.Type = parseStringField(data["Arrival Type"])
	} else {
		transportation.IsArrival = false
		prefix = "Dep"
		transportation.Type = parseStringField(data["Departure Type"])
	}

	transportation.Number = parseStringField(data[fmt.Sprintf("%s.Num", prefix)])
	date := parseStringField(data[fmt.Sprintf("%s.Date", prefix)])
	time := parseStringField(data[fmt.Sprintf("%s.Time", prefix)])
	dateTime, err := combineDateTime(date, time)
	if err != nil {
		transportation.Time = ""
	} else {
		transportation.Time = dateTime
	}

	return transportation
}

func combineDateTime(dateStr, timeStr string) (string, *common.CustomError) {
	layout := "01/02/2006 15:04"
	combinedStr := fmt.Sprintf("%s %s", dateStr, timeStr)

	parsedTime, err := time.Parse(layout, combinedStr)
	if err != nil {
		return "", common.NewCustomError(500, "error parsing date and time", err)
	}

	return parsedTime.Format("2006-01-02T15:04:05"), nil
}

func parseAccommodation(data map[string]string, allAccommodations []*accommodation.AccommodationDTO) accommodation.AccommodationDTO {
	accommodationName := parseStringField(data["Accommodation"])
	roomNumber := parseStringField(data["Room Number"])

	var assignedAccommodation accommodation.AccommodationDTO
	for _, accommodation := range allAccommodations {
		if accommodation.Name == accommodationName {
			assignedAccommodation = *accommodation
		}
	}
	assignedAccommodation.RoomNumber = roomNumber
	return assignedAccommodation
}

func parseDrinks(data map[string]string) drinks.DrinksDTO {
	var drinks drinks.DrinksDTO
	willDrink := strings.ToLower(parseStringField(data["Drinks?"]))
	if willDrink != "" && common.ArrayContains([]string{"yes", "done", "y", "true"}, willDrink) {
		drinks.WillDrinkAlcohol = true
	} else {
		drinks.WillDrinkAlcohol = false
	}
	var drinkPreferences []string
	drinkPreferenceString := parseStringField(data["Type of Drink"])
	drinkPreferences = strings.Split(drinkPreferenceString, ";")
	drinks.Preferences = drinkPreferences
	return drinks
}
