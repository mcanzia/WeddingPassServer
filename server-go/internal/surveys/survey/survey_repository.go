package survey

import (
	"context"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/surveys/surveys_models"

	"cloud.google.com/go/firestore"
)

type SurveyRepository interface {
	common.IBaseRepository[*surveys_models.Survey]
	GetPublishedSurveys(params map[string]string) ([]*surveys_models.Survey, error)
}

type surveyRepository struct {
	common.BaseRepository[*surveys_models.Survey]
}

func NewSurveyRepository(client *firestore.Client, ctx context.Context) SurveyRepository {
	coll := client.Collection("surveys")
	base := common.NewBaseRepository[*surveys_models.Survey](client, ctx, coll)
	return &surveyRepository{
		BaseRepository: base,
	}
}

func (repository *surveyRepository) GetPublishedSurveys(params map[string]string) ([]*surveys_models.Survey, error) {
	return repository.GetMultiByField(params)
}
