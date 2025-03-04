package users

import "weddingpass/server/internal/events"

type User struct {
	Id         string      `firestore:"id"`
	Email      string      `firestore:"email"`
	Phone      string      `firestore:"phone"`
	EventRoles []EventRole `firestore:"eventRoles"`
}

func NewUserInstance() *User {
	return &User{}
}

func (u *User) SetID(id string) {
	u.Id = id
}

func (u *User) GetID() string {
	return u.Id
}

type UserDTO struct {
	Id         string         `json:"id"`
	Email      string         `json:"email"`
	Phone      string         `json:"phone"`
	EventRoles []EventRoleDTO `json:"eventRoles"`
}

func NewUserDTOInstance() *UserDTO {
	return &UserDTO{}
}

type EventRole struct {
	Role    string `firestore:"role"`
	Event   string `firestore:"event"`
	GuestId string `firestore:"guestId"`
}

func NewEventRoleInstance() *EventRole {
	return &EventRole{}
}

type EventRoleDTO struct {
	Role    string          `json:"role"`
	Event   events.EventDTO `json:"event"`
	GuestId string          `json:"guestId"`
}

func NewEventRoleDTOInstance() *EventRoleDTO {
	return &EventRoleDTO{}
}

type InviteToken struct {
	Id        string    `firestore:"id"`
	Token     string    `firestore:"token"`
	EventRole EventRole `firestore:"eventRole"`
	GuestId   string    `firestore:"guestId"`
}

func NewInviteTokenInstance() *InviteToken {
	return &InviteToken{}
}

func (i *InviteToken) SetID(id string) {
	i.Id = id
}

func (i *InviteToken) GetID() string {
	return i.Id
}

type InviteTokenDTO struct {
	Token     string       `json:"token"`
	EventRole EventRoleDTO `json:"eventRole"`
	GuestId   string       `json:"guestId"`
}

func NewInviteTokenDTOInstance() *InviteTokenDTO {
	return &InviteTokenDTO{}
}
