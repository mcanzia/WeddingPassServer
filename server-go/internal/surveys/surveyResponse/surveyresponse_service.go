package surveyResponse

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/guests"
	"weddingpass/server/internal/surveys/surveys_models"
)

type SurveyResponseService interface {
	common.IBaseService[*surveys_models.SurveyResponseDTO]
	GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponseDTO, error)
	GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponseDTO, error)
	InitializeSurveyResponsesForParty(params map[string]string, survey surveys_models.SurveyDTO) ([]*surveys_models.SurveyResponseDTO, error)
	GetSurveyResponsesForParty(params map[string]string) ([]*surveys_models.SurveyResponseDTO, error)
}

type surveyResponseService struct {
	common.BaseService[*surveys_models.SurveyResponse, *surveys_models.SurveyResponseDTO]
	SurveyResponseRepository SurveyResponseRepository
	Converter                *surveys_models.SurveyConverter
}

func NewSurveyResponseService(repository SurveyResponseRepository, guestConverter *guests.GuestConverter) SurveyResponseService {
	converter := surveys_models.NewSurveyConverter(guestConverter)
	base := common.BaseService[*surveys_models.SurveyResponse, *surveys_models.SurveyResponseDTO]{
		Repository: repository,
		ConvertToDAO: func(surveyResponse *surveys_models.SurveyResponseDTO) (*surveys_models.SurveyResponse, error) {
			return converter.ConvertSurveyResponseToDAO(surveyResponse)
		},
		ConvertToDTO: func(rawSurveyResponse *surveys_models.SurveyResponse) (*surveys_models.SurveyResponseDTO, error) {
			return converter.ConvertSurveyResponseToDTO(rawSurveyResponse)
		},
	}
	return &surveyResponseService{
		BaseService: base,
		Converter:   converter,
	}
}

func (s *surveyResponseService) GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponseDTO, error) {
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

func (s *surveyResponseService) GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponseDTO, error) {
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

func (s *surveyResponseService) InitializeSurveyResponsesForParty(params map[string]string, survey surveys_models.SurveyDTO) ([]*surveys_models.SurveyResponseDTO, error) {
	panic("unimplemented")
}

func (s *surveyResponseService) GetSurveyResponsesForParty(params map[string]string) ([]*surveys_models.SurveyResponseDTO, error) {
	rawSurveyResponses, err := s.SurveyResponseRepository.GetSurveyResponsesForParty(params)
	if err != nil {
		return nil, err
	}
	surveyResponseDtos, err := s.ConvertAllToDTO(rawSurveyResponses)
	if err != nil {
		return nil, err
	}
	return surveyResponseDtos, nil
}
