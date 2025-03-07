package passes

type Pass struct {
	Id           string `firestore:"id"`
	Name         string `firestore:"name"`
	SerialNumber string `firestore:"serialNumber"`
}

func NewPassInstance() *Pass {
	return &Pass{}
}

func (p *Pass) SetID(id string) {
	p.Id = id
}

func (p *Pass) GetID() string {
	return p.Id
}

type PassDTO struct {
	Id           string `json:"id"`
	Name         string `json:"name"`
	SerialNumber string `json:"serialNumber"`
}

func NewPassDTOInstance() *PassDTO {
	return &PassDTO{}
}
