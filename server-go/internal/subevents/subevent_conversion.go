package subevents

import "weddingpass/server/internal/common"

type SubEventConverter struct {
}

func NewSubEventConverter() *SubEventConverter {
	return &SubEventConverter{}
}

func (sec *SubEventConverter) ConvertSubEventToDTO(raw *SubEvent) (*SubEventDTO, *common.CustomError) {
	dto := &SubEventDTO{
		Id:      raw.Id,
		EventId: raw.EventId,
		Name:    raw.Name,
		Order:   raw.Order,
	}
	return dto, nil
}

func (sec *SubEventConverter) ConvertSubEventToDAO(dto *SubEventDTO) (*SubEvent, *common.CustomError) {
	se := &SubEvent{
		Id:      dto.Id,
		EventId: dto.EventId,
		Name:    dto.Name,
		Order:   dto.Order,
	}
	return se, nil
}
