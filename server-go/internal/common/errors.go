package common

import "fmt"

type CustomError struct {
	Code    int
	Message string
	Err     error
}

func (e *CustomError) Error() string {
	if e.Err != nil {
		return fmt.Sprintf("%s: %v", e.Message, e.Err)
	}
	return e.Message
}

func (e *CustomError) Unwrap() error {
	return e.Err
}

func NewCustomError(code int, message string, err error) error {
	return &CustomError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}
