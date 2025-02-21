package surveys_models

import (
	"fmt"

	"weddingpass/server/internal/guests"
)

type SurveyConverter struct {
	GuestConverter *guests.GuestConverter
}

func NewSurveyConverter(guestConverter *guests.GuestConverter) *SurveyConverter {
	return &SurveyConverter{
		GuestConverter: guestConverter,
	}
}

func (sc *SurveyConverter) ConvertSurveyToDAO(surveyDto *SurveyDTO) (*Survey, error) {
	survey := &Survey{
		Id:                     surveyDto.Id,
		EventId:                surveyDto.EventId,
		Title:                  surveyDto.Title,
		Published:              surveyDto.Published,
		ShowPartyMemberSurveys: surveyDto.ShowPartyMemberSurveys,
	}
	for _, compDto := range surveyDto.SurveyComponents {
		comp, err := sc.ConvertSurveyComponentToDAO(&compDto)
		if err != nil {
			return nil, fmt.Errorf("ConvertSurveyToDAO: failed to convert survey component: %w", err)
		}
		survey.SurveyComponents = append(survey.SurveyComponents, *comp)
	}
	return survey, nil
}

func (sc *SurveyConverter) ConvertSurveyToDTO(raw *Survey) (*SurveyDTO, error) {
	dto := &SurveyDTO{
		Id:                     raw.Id,
		EventId:                raw.EventId,
		Title:                  raw.Title,
		Published:              raw.Published,
		ShowPartyMemberSurveys: raw.ShowPartyMemberSurveys,
	}
	for _, comp := range raw.SurveyComponents {
		compDTO, err := sc.ConvertSurveyComponentToDTO(&comp)
		if err != nil {
			return nil, fmt.Errorf("ConvertSurveyToDTO: failed to convert survey component: %w", err)
		}
		dto.SurveyComponents = append(dto.SurveyComponents, *compDTO)
	}
	return dto, nil
}

func (sc *SurveyConverter) ConvertSurveyComponentToDAO(surveyComponentDto *SurveyComponentDTO) (*SurveyComponent, error) {
	surveyComponent := &SurveyComponent{
		Id:              surveyComponentDto.Id,
		Label:           surveyComponentDto.Label,
		Type:            surveyComponentDto.Type,
		FriendlyName:    surveyComponentDto.FriendlyName,
		Order:           surveyComponentDto.Order,
		ComponentValue:  surveyComponentDto.ComponentValue,
		Options:         surveyComponentDto.Options,
		EditableInfo:    surveyComponentDto.EditableInfo,
		InfoLookupField: surveyComponentDto.InfoLookupField,
	}
	for _, trigDTO := range surveyComponentDto.SurveyTriggers {
		trig, err := sc.ConvertSurveyTriggerToDAO(&trigDTO)
		if err != nil {
			return nil, fmt.Errorf("ConvertSurveyComponentToDAO: failed to convert survey trigger: %w", err)
		}
		surveyComponent.SurveyTriggers = append(surveyComponent.SurveyTriggers, *trig)
	}
	return surveyComponent, nil
}

func (sc *SurveyConverter) ConvertSurveyComponentToDTO(raw *SurveyComponent) (*SurveyComponentDTO, error) {
	dto := &SurveyComponentDTO{
		Id:              raw.Id,
		Label:           raw.Label,
		Type:            raw.Type,
		FriendlyName:    raw.FriendlyName,
		Order:           raw.Order,
		ComponentValue:  raw.ComponentValue,
		Options:         raw.Options,
		EditableInfo:    raw.EditableInfo,
		InfoLookupField: raw.InfoLookupField,
	}
	for _, trig := range raw.SurveyTriggers {
		trigDTO, err := sc.ConvertSurveyTriggerToDTO(&trig)
		if err != nil {
			return nil, fmt.Errorf("ConvertSurveyComponentToDTO: failed to convert survey trigger: %w", err)
		}
		dto.SurveyTriggers = append(dto.SurveyTriggers, *trigDTO)
	}
	return dto, nil
}

func (sc *SurveyConverter) ConvertSurveyTriggerToDAO(surveyTriggerDto *SurveyTriggerDTO) (*SurveyTrigger, error) {
	surveyComponent, err := sc.ConvertSurveyComponentToDAO(&surveyTriggerDto.Child)
	if err != nil {
		return nil, fmt.Errorf("ConvertSurveyTriggerToDAO: failed to convert child component: %w", err)
	}
	surveyTrigger := &SurveyTrigger{
		TriggerField: surveyTriggerDto.TriggerField,
		Child:        *surveyComponent,
	}
	return surveyTrigger, nil
}

func (sc *SurveyConverter) ConvertSurveyTriggerToDTO(raw *SurveyTrigger) (*SurveyTriggerDTO, error) {
	childDTO, err := sc.ConvertSurveyComponentToDTO(&raw.Child)
	if err != nil {
		return nil, fmt.Errorf("ConvertSurveyTriggerToDTO: failed to convert child component: %w", err)
	}
	dto := &SurveyTriggerDTO{
		TriggerField: raw.TriggerField,
		Child:        *childDTO,
	}
	return dto, nil
}

func (sc *SurveyConverter) ConvertSurveyResponseToDAO(surveyResponseDto *SurveyResponseDTO) (*SurveyResponse, error) {

	survey, err := sc.ConvertSurveyToDAO(&surveyResponseDto.Survey)
	if err != nil {
		return nil, fmt.Errorf("ConvertSurveyResponseToDAO: failed to convert survey: %w", err)
	}

	guest, err := sc.GuestConverter.ConvertGuestToDAO(&surveyResponseDto.Guest)
	if err != nil {
		return nil, fmt.Errorf("ConvertSurveyResponseToDAO: failed to convert guest: %w", err)
	}

	surveyResponse := &SurveyResponse{
		ResponseId: surveyResponseDto.ResponseId,
		Survey:     *survey,
		Guest:      *guest,
		UpdatedAt:  surveyResponseDto.UpdatedAt,
		Submitted:  surveyResponseDto.Submitted,
	}
	return surveyResponse, nil
}

func (sc *SurveyConverter) ConvertSurveyResponseToDTO(raw *SurveyResponse) (*SurveyResponseDTO, error) {

	surveyDTO, err := sc.ConvertSurveyToDTO(&raw.Survey)
	if err != nil {
		return nil, fmt.Errorf("ConvertSurveyResponseToDTO: failed to convert survey: %w", err)
	}

	guestDTO, err := sc.GuestConverter.ConvertGuestToDTO(&raw.Guest)
	if err != nil {
		return nil, fmt.Errorf("ConvertSurveyResponseToDTO: failed to convert guest: %w", err)
	}

	dto := &SurveyResponseDTO{
		ResponseId: raw.ResponseId,
		Survey:     *surveyDTO,
		Guest:      *guestDTO,
		UpdatedAt:  raw.UpdatedAt,
		Submitted:  raw.Submitted,
	}
	return dto, nil
}
