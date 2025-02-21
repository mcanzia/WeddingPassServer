package transportation

type TransportationConverter struct {
}

func NewTransportationConverter() *TransportationConverter {
	return &TransportationConverter{}
}

func (tc *TransportationConverter) ConvertTransportationToDTO(raw *Transportation) (*TransportationDTO, error) {
	dto := &TransportationDTO{
		Id:        raw.Id,
		Type:      raw.Type,
		IsArrival: raw.IsArrival,
		Time:      raw.Time,
		Number:    raw.Number,
	}
	return dto, nil
}

func (tc *TransportationConverter) ConvertTransportationToDAO(dto *TransportationDTO) (*Transportation, error) {
	transport := &Transportation{
		Id:        dto.Id,
		Type:      dto.Type,
		IsArrival: dto.IsArrival,
		Time:      dto.Time,
		Number:    dto.Number,
	}
	return transport, nil
}
