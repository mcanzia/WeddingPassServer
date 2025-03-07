package surveyResponse

import (
	"context"
	"weddingpass/server/internal/common"
	"weddingpass/server/internal/surveys/surveys_models"

	"cloud.google.com/go/firestore"
)

type SurveyResponseRepository interface {
	common.IBaseRepository[*surveys_models.SurveyResponse]
	GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponse, *common.CustomError)
	GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponse, *common.CustomError)
	GetSurveyResponsesForParty(eventId string, surveyId string, memberIds []string) ([]*surveys_models.SurveyResponse, *common.CustomError)
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

func (repository *surveyResponseRepository) GetSurveyResponseForGuest(params map[string]string) (*surveys_models.SurveyResponse, *common.CustomError) {
	params["survey.eventId"] = params["eventId"]
	delete(params, "eventId")
	params["survey.id"] = params["surveyId"]
	delete(params, "surveyId")
	return repository.GetSingleByField(params)
}

func (repository *surveyResponseRepository) GetSurveyResponsesForGuest(params map[string]string) ([]*surveys_models.SurveyResponse, *common.CustomError) {
	params["survey.eventId"] = params["eventId"]
	delete(params, "eventId")
	params["survey.id"] = params["surveyId"]
	delete(params, "surveyId")
	return repository.GetMultiByField(params)
}

func (repository *surveyResponseRepository) GetSurveyResponsesForParty(eventId string, surveyId string, memberIds []string) ([]*surveys_models.SurveyResponse, *common.CustomError) {
	var surveyResponses []*surveys_models.SurveyResponse

	chunkSize := 10
	for i := 0; i < len(memberIds); i += chunkSize {
		end := i + chunkSize
		if end > len(memberIds) {
			end = len(memberIds)
		}
		chunk := memberIds[i:end]

		query := repository.Coll().
			Where("survey.eventId", "==", eventId).
			Where("survey.id", "==", surveyId).
			Where("guest", "in", chunk)

		docs, err := query.Documents(repository.Ctx()).GetAll()
		if err != nil {
			return nil, common.NewCustomError(500, "error fetching survey responses for party", err)
		}

		for _, doc := range docs {
			entity, err := repository.TransformDocument(doc)
			if err != nil {
				return nil, err
			}
			surveyResponses = append(surveyResponses, entity)
		}

	}

	return surveyResponses, nil
}
