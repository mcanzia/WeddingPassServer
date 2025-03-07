package subevents

import "weddingpass/server/internal/common"

type SubEventService interface {
	common.IBaseService[*SubEventDTO]
	GetSubEventByName(params map[string]string) (*SubEventDTO, *common.CustomError)
}

type subEventService struct {
	common.BaseService[*SubEvent, *SubEventDTO]
	SubEventRepository SubEventRepository
	Converter          *SubEventConverter
}

func NewSubEventService(repository SubEventRepository) SubEventService {
	converter := NewSubEventConverter()
	base := common.BaseService[*SubEvent, *SubEventDTO]{
		Repository: repository,
		ConvertToDAO: func(subEvent *SubEventDTO) (*SubEvent, *common.CustomError) {
			return converter.ConvertSubEventToDAO(subEvent)
		},
		ConvertToDTO: func(rawSubEvent *SubEvent) (*SubEventDTO, *common.CustomError) {
			return converter.ConvertSubEventToDTO(rawSubEvent)
		},
	}
	return &subEventService{
		BaseService:        base,
		SubEventRepository: repository,
		Converter:          converter,
	}
}

func (s *subEventService) GetSubEventByName(params map[string]string) (*SubEventDTO, *common.CustomError) {
	rawSubEvent, err := s.SubEventRepository.GetSubEventByName(params)
	if err != nil {
		return nil, err
	}
	subEventDto, err := s.ConvertToDTO(rawSubEvent)
	if err != nil {
		return nil, err
	}
	return subEventDto, nil
}
