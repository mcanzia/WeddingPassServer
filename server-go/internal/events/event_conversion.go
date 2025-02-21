package events

type EventConverter struct {
}

func NewEventConverter() *EventConverter {
	return &EventConverter{}
}

func (ec *EventConverter) ConvertEventToDAO(event *EventDTO) (*Event, error) {
	dao := &Event{
		Id:       event.Id,
		Name:     event.Name,
		Date:     event.Date,
		Location: event.Location,
		OwnerId:  event.OwnerId,
	}

	return dao, nil
}

func (ec *EventConverter) ConvertEventToDTO(rawEvent *Event) (*EventDTO, error) {
	dto := &EventDTO{
		Id:       rawEvent.Id,
		Name:     rawEvent.Name,
		Date:     rawEvent.Date,
		Location: rawEvent.Location,
		OwnerId:  rawEvent.OwnerId,
	}

	return dto, nil
}
