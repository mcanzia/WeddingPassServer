package surveyResponse

import (
	"time"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/guests"
	"weddingpass/server/internal/surveys/surveys_models"
)

type SurveyResponseService interface {
	common.IBaseService[*surveys_models.SurveyResponseDTO]
	GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponseDTO, *common.CustomError)
	GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponseDTO, *common.CustomError)
	InitializeSurveyResponsesForParty(params map[string]string, survey surveys_models.SurveyDTO) ([]*surveys_models.SurveyResponseDTO, *common.CustomError)
	GetSurveyResponsesForParty(params map[string]string) ([]*surveys_models.SurveyResponseDTO, *common.CustomError)
}

type surveyResponseService struct {
	common.BaseService[*surveys_models.SurveyResponse, *surveys_models.SurveyResponseDTO]
	SurveyResponseRepository SurveyResponseRepository
	GuestRepository          guests.GuestRepository
	Converter                *surveys_models.SurveyConverter
}

func NewSurveyResponseService(repository SurveyResponseRepository, guestConverter *guests.GuestConverter, guestRepository guests.GuestRepository, guestService guests.GuestService) SurveyResponseService {
	converter := surveys_models.NewSurveyConverter(guestConverter, guestService)
	base := common.BaseService[*surveys_models.SurveyResponse, *surveys_models.SurveyResponseDTO]{
		Repository: repository,
		ConvertToDAO: func(surveyResponse *surveys_models.SurveyResponseDTO) (*surveys_models.SurveyResponse, *common.CustomError) {
			return converter.ConvertSurveyResponseToDAO(surveyResponse)
		},
		ConvertToDTO: func(rawSurveyResponse *surveys_models.SurveyResponse) (*surveys_models.SurveyResponseDTO, *common.CustomError) {
			return converter.ConvertSurveyResponseToDTO(rawSurveyResponse)
		},
	}
	return &surveyResponseService{
		BaseService:              base,
		SurveyResponseRepository: repository,
		GuestRepository:          guestRepository,
		Converter:                converter,
	}
}

func (s *surveyResponseService) GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponseDTO, *common.CustomError) {
	rawSurveyResponses, err := s.SurveyResponseRepository.GetSurveyResponsesForGuest(params)
	if err != nil {
		return nil, err
	}
	surveyResponseDtos, err := s.ConvertAllToDTO(rawSurveyResponses)
	if err != nil {
		return nil, err
	}
	return surveyResponseDtos, nil
}

func (s *surveyResponseService) GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponseDTO, *common.CustomError) {
	rawSurveyResponse, err := s.SurveyResponseRepository.GetSurveyResponseForGuest(params)
	if err != nil {
		return nil, err
	}
	surveyResponseDto, err := s.ConvertToDTO(rawSurveyResponse)
	if err != nil {
		return nil, err
	}
	return surveyResponseDto, nil
}

func (s *surveyResponseService) InitializeSurveyResponsesForParty(params map[string]string, surveyDto surveys_models.SurveyDTO) ([]*surveys_models.SurveyResponseDTO, *common.CustomError) {
	// Setup party member params
	// partyMemberParams := make(map[string]string)
	// eventId, ok := params["eventId"]
	// if !ok {
	// 	return nil, common.NewCustomError(400, "missing event id in params", nil)
	// }
	// partyMemberParams["eventId"] = eventId
	// guestId, ok := params["guestId"]
	// if !ok {
	// 	return nil, common.NewCustomError(400, "missing guest id in params", nil)
	// }
	// partyMemberParams["id"] = guestId

	partyMembers, fetchGuestsErr := s.GuestRepository.FetchPartyMembers(params)
	if fetchGuestsErr != nil {
		return nil, fetchGuestsErr
	}

	// Convert surveyDTO to raw survey
	survey, convertErr := s.Converter.ConvertSurveyToDAO(&surveyDto)
	if convertErr != nil {
		return nil, convertErr
	}

	// Loop through members and add created survey responses
	var surveyResponses []*surveys_models.SurveyResponseDTO
	for _, member := range partyMembers {
		rawSurveyResponse := surveys_models.SurveyResponse{
			Survey:    *survey,
			Guest:     member.Id,
			UpdatedAt: time.Now(),
			Submitted: false,
		}
		createdSurveyResponse, createErr := s.SurveyResponseRepository.Save(params, &rawSurveyResponse)
		if createErr != nil {
			return nil, createErr
		}
		surveyResponseDTO, convertErr := s.Converter.ConvertSurveyResponseToDTO(createdSurveyResponse)
		if convertErr != nil {
			return nil, convertErr
		}
		surveyResponses = append(surveyResponses, surveyResponseDTO)
	}

	return surveyResponses, nil

}

func (s *surveyResponseService) GetSurveyResponsesForParty(params map[string]string) ([]*surveys_models.SurveyResponseDTO, *common.CustomError) {
	// Fetch party members
	eventId, ok := params["eventId"]
	if !ok {
		return nil, common.NewCustomError(400, "event id param not provided", nil)
	}
	surveyId, ok := params["surveyId"]
	if !ok {
		return nil, common.NewCustomError(400, "survey id param not provided", nil)
	}
	delete(params, "surveyId")
	partyMembers, fetchPartyErr := s.GuestRepository.FetchPartyMembers(params)
	if fetchPartyErr != nil {
		return nil, fetchPartyErr
	}
	var memberIds []string
	for _, member := range partyMembers {
		memberIds = append(memberIds, member.Id)
	}
	// Fetch survey responses
	rawSurveyResponses, err := s.SurveyResponseRepository.GetSurveyResponsesForParty(eventId, surveyId, memberIds)
	if err != nil {
		return nil, err
	}
	surveyResponseDtos, err := s.ConvertAllToDTO(rawSurveyResponses)
	if err != nil {
		return nil, err
	}
	return surveyResponseDtos, nil
}
