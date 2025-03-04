package survey

import (
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/guests"
	"weddingpass/server/internal/surveys/surveys_models"
)

type SurveyService interface {
	common.IBaseService[*surveys_models.SurveyDTO]
	GetPublishedSurveys(params map[string]string) ([]*surveys_models.SurveyDTO, *common.CustomError)
}

type surveyService struct {
	common.BaseService[*surveys_models.Survey, *surveys_models.SurveyDTO]
	SurveyRepository SurveyRepository
	Converter        *surveys_models.SurveyConverter
}

func NewSurveyService(repository SurveyRepository, guestConverter *guests.GuestConverter, guestService guests.GuestService) SurveyService {
	converter := surveys_models.NewSurveyConverter(guestConverter, guestService)
	base := common.BaseService[*surveys_models.Survey, *surveys_models.SurveyDTO]{
		Repository: repository,
		ConvertToDAO: func(survey *surveys_models.SurveyDTO) (*surveys_models.Survey, *common.CustomError) {
			return converter.ConvertSurveyToDAO(survey)
		},
		ConvertToDTO: func(rawSurvey *surveys_models.Survey) (*surveys_models.SurveyDTO, *common.CustomError) {
			return converter.ConvertSurveyToDTO(rawSurvey)
		},
	}
	return &surveyService{
		BaseService:      base,
		SurveyRepository: repository,
		Converter:        converter,
	}
}

func (s *surveyService) GetPublishedSurveys(params map[string]string) ([]*surveys_models.SurveyDTO, *common.CustomError) {
	rawSurveys, err := s.SurveyRepository.GetPublishedSurveys(params)
	if err != nil {
		return nil, err
	}
	surveyDtos, err := s.ConvertAllToDTO(rawSurveys)
	if err != nil {
		return nil, err
	}
	return surveyDtos, nil
}
