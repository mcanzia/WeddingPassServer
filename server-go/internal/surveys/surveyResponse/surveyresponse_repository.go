package surveyResponse

import (
	"context"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/surveys/surveys_models"

	"cloud.google.com/go/firestore"
)

type SurveyResponseRepository interface {
	common.IBaseRepository[*surveys_models.SurveyResponse]
	GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponse, error)
	GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponse, error)
	GetSurveyResponsesForParty(params map[string]string) ([]*surveys_models.SurveyResponse, error)
}

type surveyResponseRepository struct {
	common.BaseRepository[*surveys_models.SurveyResponse]
}

func NewSurveyResponseRepository(client *firestore.Client, ctx context.Context) SurveyResponseRepository {
	coll := client.Collection("surveyResponses")
	base := common.NewBaseRepository[*surveys_models.SurveyResponse](client, ctx, coll)
	return &surveyResponseRepository{
		BaseRepository: base,
	}
}

func (repository *surveyResponseRepository) GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponse, error) {
	return repository.GetSingleByField(params)
}

func (repository *surveyResponseRepository) GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponse, error) {
	return repository.GetMultiByField(params)
}

// GetSurveyResponsesForParty implements SurveyResponseRepository.
func (repository *surveyResponseRepository) GetSurveyResponsesForParty(params map[string]string) ([]*surveys_models.SurveyResponse, error) {
	panic("unimplemented")
}
