package common

type BaseService[T any, D any] struct {
	Repository   IBaseRepository[T]
	ConvertToDAO func(entity D) (T, *CustomError)
	ConvertToDTO func(entity T) (D, *CustomError)
}

func (service *BaseService[T, D]) GetAll(params map[string]string) ([]D, *CustomError) {
	rawEntities, err := service.Repository.GetAll(params)
	if err != nil {
		return nil, err
	}
	dtos, err := service.ConvertAllToDTO(rawEntities)
	if err != nil {
		return nil, err
	}
	return dtos, nil
}

func (service *BaseService[T, D]) GetByID(params map[string]string) (D, *CustomError) {
	rawEntity, err := service.Repository.GetByID(params)
	var zero D
	if err != nil {
		return zero, err
	}
	dto, err := service.ConvertToDTO(rawEntity)
	if err != nil {
		return zero, err
	}
	return dto, nil
}

func (service *BaseService[T, D]) Save(params map[string]string, entity D) (D, *CustomError) {
	rawEntity, err := service.ConvertToDAO(entity)
	var zero D
	if err != nil {
		return zero, err
	}

	createdEntity, err := service.Repository.Save(params, rawEntity)
	if err != nil {
		return zero, err
	}

	dto, err := service.ConvertToDTO(createdEntity)
	if err != nil {
		return zero, err
	}
	return dto, nil
}

func (service *BaseService[T, D]) BatchCreate(params map[string]string, entities []D) *CustomError {
	rawEntities, err := service.ConvertAllToDAO(entities)
	if err != nil {
		return err
	}

	err = service.Repository.BatchCreate(params, rawEntities)
	if err != nil {
		return err
	}

	return nil
}

// func (service *BaseService[T, D]) Update(params map[string]string, entity D) (D, *CustomError) {
// 	rawEntity, err := service.ConvertToDAO(entity)
// 	var zero D
// 	if err != nil {
// 		return zero, err
// 	}

// 	updatedEntity, err := service.Repository.Update(params, rawEntity)
// 	if err != nil {
// 		return zero, err
// 	}

// 	dto, err := service.ConvertToDTO(updatedEntity)
// 	if err != nil {
// 		return zero, err
// 	}
// 	return dto, nil
// }

func (service *BaseService[T, D]) Delete(params map[string]string) *CustomError {
	err := service.Repository.Delete(params)
	if err != nil {
		return err
	}
	return nil
}

func (service *BaseService[T, D]) BatchDelete(params map[string]string, entities []D) *CustomError {
	rawEntities, err := service.ConvertAllToDAO(entities)
	if err != nil {
		return err
	}

	err = service.Repository.BatchDelete(params, rawEntities)
	if err != nil {
		return err
	}

	return nil
}

func (service *BaseService[T, D]) ConvertAllToDTO(rawEntities []T) ([]D, *CustomError) {
	var dtos []D
	for _, raw := range rawEntities {
		dto, err := service.ConvertToDTO(raw)
		if err != nil {
			return nil, err
		}
		dtos = append(dtos, dto)
	}
	return dtos, nil
}

func (service *BaseService[T, D]) ConvertAllToDAO(entities []D) ([]T, *CustomError) {
	var daos []T
	for _, entity := range entities {
		dao, err := service.ConvertToDAO(entity)
		if err != nil {
			return nil, err
		}
		daos = append(daos, dao)
	}
	return daos, nil
}
