package passes

type PassConverter struct {
}

func NewPassConverter() *PassConverter {
	return &PassConverter{}
}

func (pc *PassConverter) ConvertPassToDTO(rawPass *Pass) (*PassDTO, error) {
	dto := &PassDTO{
		Id:           rawPass.Id,
		Name:         rawPass.Name,
		SerialNumber: rawPass.SerialNumber,
	}
	return dto, nil
}

func (pc *PassConverter) ConvertPassToDAO(dto *PassDTO) (*Pass, error) {
	pass := &Pass{
		Id:           dto.Id,
		Name:         dto.Name,
		SerialNumber: dto.SerialNumber,
	}
	return pass, nil
}
