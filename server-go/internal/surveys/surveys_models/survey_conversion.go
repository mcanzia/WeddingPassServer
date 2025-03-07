package surveys_models

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/guests"
)

type SurveyConverter struct {
	GuestConverter *guests.GuestConverter
	GuestService   guests.GuestService
}

func NewSurveyConverter(guestConverter *guests.GuestConverter, guestService guests.GuestService) *SurveyConverter {
	return &SurveyConverter{
		GuestConverter: guestConverter,
		GuestService:   guestService,
	}
}

func (sc *SurveyConverter) ConvertSurveyToDAO(surveyDto *SurveyDTO) (*Survey, *common.CustomError) {
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
			return nil, err
		}
		survey.SurveyComponents = append(survey.SurveyComponents, *comp)
	}
	return survey, nil
}

func (sc *SurveyConverter) ConvertSurveyToDTO(raw *Survey) (*SurveyDTO, *common.CustomError) {
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
			return nil, err
		}
		dto.SurveyComponents = append(dto.SurveyComponents, *compDTO)
	}
	return dto, nil
}

func (sc *SurveyConverter) ConvertSurveyComponentToDAO(surveyComponentDto *SurveyComponentDTO) (*SurveyComponent, *common.CustomError) {
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
			return nil, err
		}
		surveyComponent.SurveyTriggers = append(surveyComponent.SurveyTriggers, *trig)
	}
	return surveyComponent, nil
}

func (sc *SurveyConverter) ConvertSurveyComponentToDTO(raw *SurveyComponent) (*SurveyComponentDTO, *common.CustomError) {
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
			return nil, err
		}
		dto.SurveyTriggers = append(dto.SurveyTriggers, *trigDTO)
	}
	return dto, nil
}

func (sc *SurveyConverter) ConvertSurveyTriggerToDAO(surveyTriggerDto *SurveyTriggerDTO) (*SurveyTrigger, *common.CustomError) {
	surveyComponent, err := sc.ConvertSurveyComponentToDAO(&surveyTriggerDto.Child)
	if err != nil {
		return nil, err
	}
	surveyTrigger := &SurveyTrigger{
		TriggerField: surveyTriggerDto.TriggerField,
		Child:        *surveyComponent,
	}
	return surveyTrigger, nil
}

func (sc *SurveyConverter) ConvertSurveyTriggerToDTO(raw *SurveyTrigger) (*SurveyTriggerDTO, *common.CustomError) {
	childDTO, err := sc.ConvertSurveyComponentToDTO(&raw.Child)
	if err != nil {
		return nil, err
	}
	dto := &SurveyTriggerDTO{
		TriggerField: raw.TriggerField,
		Child:        *childDTO,
	}
	return dto, nil
}

func (sc *SurveyConverter) ConvertSurveyResponseToDAO(surveyResponseDto *SurveyResponseDTO) (*SurveyResponse, *common.CustomError) {

	survey, err := sc.ConvertSurveyToDAO(&surveyResponseDto.Survey)
	if err != nil {
		return nil, err
	}

	surveyResponse := &SurveyResponse{
		ResponseId: surveyResponseDto.ResponseId,
		Survey:     *survey,
		Guest:      surveyResponseDto.Guest.Id,
		UpdatedAt:  surveyResponseDto.UpdatedAt,
		Submitted:  surveyResponseDto.Submitted,
	}
	return surveyResponse, nil
}

func (sc *SurveyConverter) ConvertSurveyResponseToDTO(raw *SurveyResponse) (*SurveyResponseDTO, *common.CustomError) {

	surveyDTO, err := sc.ConvertSurveyToDTO(&raw.Survey)
	if err != nil {
		return nil, err
	}

	params := make(map[string]string)
	params["eventId"] = raw.Survey.EventId
	params["id"] = raw.Guest
	guestDTO, err := sc.GuestService.GetByID(params)
	if err != nil {
		return nil, err
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
