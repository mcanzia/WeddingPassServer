package pendingguests

import "weddingpass/server/internal/common"

type PendingGuestConverter struct{}

func NewPendingGuestConverter() *PendingGuestConverter {
	return &PendingGuestConverter{}
}

func (gc *PendingGuestConverter) ConvertPendingGuestToDAO(pendingGuestDto *PendingGuestDTO) (*PendingGuest, *common.CustomError) {
	pendingGuest := &PendingGuest{
		Id:        pendingGuestDto.Id,
		UserId:    pendingGuestDto.UserId,
		EventId:   pendingGuestDto.EventId,
		GuestName: pendingGuestDto.GuestName,
		Email:     pendingGuestDto.Email,
		Phone:     pendingGuestDto.Phone,
		Status:    pendingGuestDto.Status,
	}
	return pendingGuest, nil
}

func (gc *PendingGuestConverter) ConvertPendingGuestToDTO(raw *PendingGuest) (*PendingGuestDTO, *common.CustomError) {
	dto := &PendingGuestDTO{
		Id:        raw.Id,
		UserId:    raw.UserId,
		EventId:   raw.EventId,
		GuestName: raw.GuestName,
		Email:     raw.Email,
		Phone:     raw.Phone,
		Status:    raw.Status,
	}
	return dto, nil
}
