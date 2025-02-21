package common

type Identifiable interface {
	SetID(id string)
	GetID() string
}

type IBaseService[D any] interface {
	GetAll(params map[string]string) ([]D, error)
	GetByID(params map[string]string) (D, error)
	Save(params map[string]string, entity D) (D, error)
	BatchCreate(params map[string]string, entities []D) error
	// Update(params map[string]string, entity D) (D, error)
	Delete(params map[string]string) error
	BatchDelete(params map[string]string, entities []D) error
}

type IBaseRepository[T any] interface {
	GetAll(params map[string]string) ([]T, error)
	GetByID(params map[string]string) (T, error)
	Save(params map[string]string, entity T) (T, error)
	BatchCreate(params map[string]string, entities []T) error
	// Update(params map[string]string, entity T) (T, error)
	Delete(params map[string]string) error
	BatchDelete(params map[string]string, entities []T) error
}
