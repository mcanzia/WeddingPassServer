package surveys_models

import (
	"time"
	"weddingpass/server/internal/guests"
)

type Survey struct {
	Id                     string            `json:"id"`
	EventId                string            `json:"eventId"`
	Title                  string            `json:"title"`
	SurveyComponents       []SurveyComponent `json:"surveyComponents"`
	Published              bool              `json:"published"`
	ShowPartyMemberSurveys bool              `json:"showPartyMemberSurveys"`
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
	Id              string          `json:"id"`
	Label           string          `json:"label"`
	Type            string          `json:"type"`
	FriendlyName    string          `json:"friendlyName"`
	Order           int             `json:"order"`
	ComponentValue  interface{}     `json:"componentValue"`
	Options         []string        `json:"options"`
	SurveyTriggers  []SurveyTrigger `json:"surveyTriggers"`
	EditableInfo    bool            `json:"editableInfo"`
	InfoLookupField string          `json:"infoLookupField"`
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
	TriggerField string          `json:"triggerField"`
	Child        SurveyComponent `json:"child"`
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
	ResponseId string       `json:"responseId"`
	Guest      guests.Guest `json:"guest"`
	Survey     Survey       `json:"survey"`
	UpdatedAt  time.Time    `json:"updatedAt"`
	Submitted  bool         `json:"submitted"`
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
