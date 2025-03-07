package common

import (
	"errors"
	"fmt"
)

type CustomError struct {
	Code    int
	Message string
	Err     error
}

func (e *CustomError) Error() string {
	if e.Err != nil {
		return fmt.Errorf("%s: %w", e.Message, e.Err).Error()
	}
	return e.Message
}

func (e *CustomError) ErrorCode() int {
	return e.Code
}

func (e *CustomError) Unwrap() error {
	return errors.Unwrap(e.Err)
}

func IsCustomError(err error) bool {
	var customErr *CustomError
	return errors.As(err, &customErr)
}

func NewCustomError(code int, message string, err error) *CustomError {
	return &CustomError{
		Code:    code,
		Message: message,
		Err:     err,
	}
}
