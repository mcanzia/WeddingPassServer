package transportation

import "weddingpass/server/internal/common"

type TransportationConverter struct {
}

func NewTransportationConverter() *TransportationConverter {
	return &TransportationConverter{}
}

func (tc *TransportationConverter) ConvertTransportationToDTO(raw *Transportation) (*TransportationDTO, *common.CustomError) {
	dto := &TransportationDTO{
		Type:      raw.Type,
		IsArrival: raw.IsArrival,
		Time:      raw.Time,
		Number:    raw.Number,
	}
	return dto, nil
}

func (tc *TransportationConverter) ConvertTransportationToDAO(dto *TransportationDTO) (*Transportation, *common.CustomError) {
	transport := &Transportation{
		Type:      dto.Type,
		IsArrival: dto.IsArrival,
		Time:      dto.Time,
		Number:    dto.Number,
	}
	return transport, nil
}
