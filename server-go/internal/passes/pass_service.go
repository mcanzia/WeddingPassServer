package passes

import (
	"weddingpass/server/internal/common"
)

type PassService interface {
	common.IBaseService[*PassDTO]
}

type passService struct {
	common.BaseService[*Pass, *PassDTO]
	PassRepository PassRepository
	Converter      *PassConverter
}

func NewPassService(repository PassRepository) PassService {
	converter := NewPassConverter()
	base := common.BaseService[*Pass, *PassDTO]{
		Repository: repository,
		ConvertToDAO: func(pass *PassDTO) (*Pass, *common.CustomError) {
			return converter.ConvertPassToDAO(pass)
		},
		ConvertToDTO: func(rawPass *Pass) (*PassDTO, *common.CustomError) {
			return converter.ConvertPassToDTO(rawPass)
		},
	}
	return &passService{
		BaseService:    base,
		PassRepository: repository,
		Converter:      converter,
	}
}
