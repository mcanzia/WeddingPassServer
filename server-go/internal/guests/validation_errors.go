package guests

const (
	NameMissing        = "Name field is empty."
	NameTooLong        = "Name field must be less than 50 characters."
	EmailMissing       = "Email field is empty."
	EmailTooLong       = "Email field must be less than 50 characters."
	EmailBadFormat     = "Email field has incorrect format (test@example.com)."
	PhoneTooLong       = "Phone field must be less than 50 characters."
	DuplicateGuest     = "A guest with this name already exists."
	MissingEvent       = "A guest must be invited to at least one event."
	PartyNumberMissing = "Party Number field is empty."
)
