package passes

import "weddingpass/server/internal/common"

type PassConverter struct {
}

func NewPassConverter() *PassConverter {
	return &PassConverter{}
}

func (pc *PassConverter) ConvertPassToDTO(rawPass *Pass) (*PassDTO, *common.CustomError) {
	dto := &PassDTO{
		Id:           rawPass.Id,
		Name:         rawPass.Name,
		SerialNumber: rawPass.SerialNumber,
	}
	return dto, nil
}

func (pc *PassConverter) ConvertPassToDAO(dto *PassDTO) (*Pass, *common.CustomError) {
	pass := &Pass{
		Id:           dto.Id,
		Name:         dto.Name,
		SerialNumber: dto.SerialNumber,
	}
	return pass, nil
}
