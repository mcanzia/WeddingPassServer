package surveys_models

import (
	"time"
	"weddingpass/server/internal/guests"
)

type Survey struct {
	Id                     string            `firestore:"id"`
	EventId                string            `firestore:"eventId"`
	Title                  string            `firestore:"title"`
	SurveyComponents       []SurveyComponent `firestore:"surveyComponents"`
	Published              bool              `firestore:"published"`
	ShowPartyMemberSurveys bool              `firestore:"showPartyMemberSurveys"`
}

func NewSurveyInstance() *Survey {
	return &Survey{}
}

func (s *Survey) SetID(id string) {
	s.Id = id
}

func (s *Survey) GetID() string {
	return s.Id
}

type SurveyDTO struct {
	Id                     string               `json:"id"`
	EventId                string               `json:"eventId"`
	Title                  string               `json:"title"`
	SurveyComponents       []SurveyComponentDTO `json:"surveyComponents"`
	Published              bool                 `json:"published"`
	ShowPartyMemberSurveys bool                 `json:"showPartyMemberSurveys"`
}

func NewSurveyDTOInstance() *SurveyDTO {
	return &SurveyDTO{}
}

type SurveyComponent struct {
	Id              string          `firestore:"id"`
	Label           string          `firestore:"label"`
	Type            string          `firestore:"type"`
	FriendlyName    string          `firestore:"friendlyName"`
	Order           int             `firestore:"order"`
	ComponentValue  interface{}     `firestore:"componentValue"`
	Options         []string        `firestore:"options"`
	SurveyTriggers  []SurveyTrigger `firestore:"surveyTriggers"`
	EditableInfo    bool            `firestore:"editableInfo"`
	InfoLookupField string          `firestore:"infoLookupField"`
}

func NewSurveyComponentInstance() *SurveyComponent {
	return &SurveyComponent{}
}

func (sc *SurveyComponent) SetID(id string) {
	sc.Id = id
}

func (sc *SurveyComponent) GetID() string {
	return sc.Id
}

type SurveyComponentDTO struct {
	Id              string             `json:"id"`
	Label           string             `json:"label"`
	Type            string             `json:"type"`
	FriendlyName    string             `json:"friendlyName"`
	Order           int                `json:"order"`
	ComponentValue  interface{}        `json:"componentValue"`
	Options         []string           `json:"options"`
	SurveyTriggers  []SurveyTriggerDTO `json:"surveyTriggers"`
	EditableInfo    bool               `json:"editableInfo"`
	InfoLookupField string             `json:"infoLookupField"`
}

func NewSurveyComponentDTOInstance() *SurveyComponentDTO {
	return &SurveyComponentDTO{}
}

type SurveyTrigger struct {
	TriggerField string          `firestore:"triggerField"`
	Child        SurveyComponent `firestore:"child"`
}

func NewSurveyTriggerInstance() *SurveyTrigger {
	return &SurveyTrigger{}
}

type SurveyTriggerDTO struct {
	TriggerField string             `json:"triggerField"`
	Child        SurveyComponentDTO `json:"child"`
}

func NewSurveyTriggerDTOInstance() *SurveyTriggerDTO {
	return &SurveyTriggerDTO{}
}

type SurveyResponse struct {
	ResponseId string    `firestore:"responseId"`
	Guest      string    `firestore:"guest"`
	Survey     Survey    `firestore:"survey"`
	UpdatedAt  time.Time `firestore:"updatedAt"`
	Submitted  bool      `firestore:"submitted"`
}

func NewSurveyResponseInstance() *SurveyResponse {
	return &SurveyResponse{}
}

func (sr *SurveyResponse) SetID(id string) {
	sr.ResponseId = id
}

func (sr *SurveyResponse) GetID() string {
	return sr.ResponseId
}

type SurveyResponseDTO struct {
	ResponseId string          `json:"responseId"`
	Guest      guests.GuestDTO `json:"guest"`
	Survey     SurveyDTO       `json:"survey"`
	UpdatedAt  time.Time       `json:"updatedAt"`
	Submitted  bool            `json:"submitted"`
}

func NewSurveyResponseDTOInstance() *SurveyResponseDTO {
	return &SurveyResponseDTO{}
}
