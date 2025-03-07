package events

import "weddingpass/server/internal/common"

type EventConverter struct {
}

func NewEventConverter() *EventConverter {
	return &EventConverter{}
}

func (ec *EventConverter) ConvertEventToDAO(event *EventDTO) (*Event, *common.CustomError) {
	dao := &Event{
		Id:       event.Id,
		Name:     event.Name,
		Date:     event.Date,
		Location: event.Location,
		OwnerId:  event.OwnerId,
	}

	return dao, nil
}

func (ec *EventConverter) ConvertEventToDTO(rawEvent *Event) (*EventDTO, *common.CustomError) {
	dto := &EventDTO{
		Id:       rawEvent.Id,
		Name:     rawEvent.Name,
		Date:     rawEvent.Date,
		Location: rawEvent.Location,
		OwnerId:  rawEvent.OwnerId,
	}

	return dto, nil
}
