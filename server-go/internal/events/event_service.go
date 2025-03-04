package events

import "weddingpass/server/internal/common"

type EventService interface {
	common.IBaseService[*EventDTO]
	GetEventsByOwner(params map[string]string) ([]*EventDTO, error)
	GetEventByName(params map[string]string) (*EventDTO, error)
}

type eventService struct {
	common.BaseService[*Event, *EventDTO]
	EventRepository EventRepository
	Converter       *EventConverter
}

func NewEventService(repository EventRepository) EventService {
	converter := NewEventConverter()
	base := common.BaseService[*Event, *EventDTO]{
		Repository: repository,
		ConvertToDAO: func(event *EventDTO) (*Event, *common.CustomError) {
			return converter.ConvertEventToDAO(event)
		},
		ConvertToDTO: func(rawEvent *Event) (*EventDTO, *common.CustomError) {
			return converter.ConvertEventToDTO(rawEvent)
		},
	}
	return &eventService{
		BaseService:     base,
		EventRepository: repository,
		Converter:       converter,
	}
}

func (s *eventService) GetEventsByOwner(params map[string]string) ([]*EventDTO, error) {
	rawEvents, err := s.EventRepository.GetEventsByOwner(params)
	if err != nil {
		return nil, err
	}
	eventDtos, err := s.ConvertAllToDTO(rawEvents)
	if err != nil {
		return nil, err
	}
	return eventDtos, nil
}

func (s *eventService) GetEventByName(params map[string]string) (*EventDTO, error) {
	rawEvent, err := s.EventRepository.GetEventByName(params)
	if err != nil {
		return nil, err
	}
	eventDto, err := s.ConvertToDTO(rawEvent)
	if err != nil {
		return nil, err
	}
	return eventDto, nil
}
