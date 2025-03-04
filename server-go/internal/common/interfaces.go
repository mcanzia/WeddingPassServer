package common

type Identifiable interface {
	SetID(id string)
	GetID() string
}

type IBaseService[D any] interface {
	GetAll(params map[string]string) ([]D, *CustomError)
	GetByID(params map[string]string) (D, *CustomError)
	Save(params map[string]string, entity D) (D, *CustomError)
	BatchCreate(params map[string]string, entities []D) *CustomError
	// Update(params map[string]string, entity D) (D, *CustomError)
	Delete(params map[string]string) *CustomError
	BatchDelete(params map[string]string, entities []D) *CustomError
}

type IBaseRepository[T any] interface {
	GetAll(params map[string]string) ([]T, *CustomError)
	GetByID(params map[string]string) (T, *CustomError)
	Save(params map[string]string, entity T) (T, *CustomError)
	BatchCreate(params map[string]string, entities []T) *CustomError
	// Update(params map[string]string, entity T) (T, *CustomError)
	Delete(params map[string]string) *CustomError
	BatchDelete(params map[string]string, entities []T) *CustomError
}
