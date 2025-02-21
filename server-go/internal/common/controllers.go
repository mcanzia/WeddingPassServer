package common

import (
	"fmt"
	"net/http"
	"reflect"
	"weddingpass/server/internal/logger"

	"github.com/gin-gonic/gin"
)

type BaseController[T any] struct {
	Service IBaseService[T]
}

func (bc *BaseController[T]) RespondWithError(context *gin.Context, code int, message string) {
	context.JSON(code, gin.H{"error": message})
}

func (bc *BaseController[T]) RespondWithJSON(context *gin.Context, code int, payload interface{}) {
	context.JSON(code, payload)
}

func (bc *BaseController[T]) NewInstance() (T, error) {
	var zero T
	typ := reflect.TypeOf(zero)
	// Using this to check if typ is a pointer type
	if typ == nil || typ.Kind() == reflect.Pointer && typ.Elem().Kind() != reflect.Invalid {
		// Since the factory function map uses pointer types as keys,
		// we want to make sure we aren't accidentally passing in a double pointer
		typ = reflect.TypeOf((*T)(nil)).Elem()
	}

	instance, err := GetNewInstance(typ)
	if err != nil {
		return zero, err
	}
	newInstance, ok := instance.(T)
	if !ok {
		return zero, fmt.Errorf("factory for type %v did not return correct type", typ)
	}
	return newInstance, nil
}

func GetFiltersFromContext(c *gin.Context, lookupKeys ...string) map[string]string {
	filters := make(map[string]string)
	for _, key := range lookupKeys {
		if value := c.Param(key); value != "" {
			filters[key] = value
		}
	}
	return filters
}

func (bc *BaseController[T]) GetAll(context *gin.Context, lookupKeys ...string) {
	filters := GetFiltersFromContext(context, lookupKeys...)

	items, err := bc.Service.GetAll(filters)
	if err != nil {
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}
	bc.RespondWithJSON(context, http.StatusOK, items)
}

func (bc *BaseController[T]) GetByID(context *gin.Context, lookupKeys ...string) {
	filters := GetFiltersFromContext(context, lookupKeys...)

	user, err := bc.Service.GetByID(filters)
	if err != nil {
		logger.Global.Error(err.Error())
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}
	bc.RespondWithJSON(context, http.StatusOK, user)
}

func (bc *BaseController[T]) Save(context *gin.Context, lookupKeys ...string) {
	filters := GetFiltersFromContext(context, lookupKeys...)

	itemToCreate, err := bc.NewInstance()
	if err != nil {
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}

	if err := context.ShouldBindJSON(itemToCreate); err != nil {
		bc.RespondWithError(context, http.StatusBadRequest, err.Error())
		return
	}

	createdItem, err := bc.Service.Save(filters, itemToCreate)
	if err != nil {
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}

	bc.RespondWithJSON(context, http.StatusCreated, createdItem)
}

func (bc *BaseController[T]) BatchCreate(context *gin.Context, lookupKeys ...string) {
	filters := GetFiltersFromContext(context, lookupKeys...)

	var itemsToCreate []T
	if err := context.ShouldBindJSON(&itemsToCreate); err != nil {
		bc.RespondWithError(context, http.StatusBadRequest, err.Error())
		return
	}

	err := bc.Service.BatchCreate(filters, itemsToCreate)
	if err != nil {
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}

	bc.RespondWithJSON(context, http.StatusCreated, "")
}

// func (bc *BaseController[T]) Update(context *gin.Context, lookupKeys ...string) {
// 	filters := GetFiltersFromContext(context, lookupKeys...)
// 	var itemToUpdate T
// 	if err := context.ShouldBindJSON(&itemToUpdate); err != nil {
// 		bc.RespondWithError(context, http.StatusBadRequest, err.Error())
// 		return
// 	}

// 	updatedItem, err := bc.Service.Update(filters, itemToUpdate)
// 	if err != nil {
// 		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
// 		return
// 	}

// 	bc.RespondWithJSON(context, http.StatusOK, updatedItem)
// }

func (bc *BaseController[T]) Delete(context *gin.Context, lookupKeys ...string) {
	filters := GetFiltersFromContext(context, lookupKeys...)

	err := bc.Service.Delete(filters)
	if err != nil {
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}
	context.Status(http.StatusNoContent)
}

func (bc *BaseController[T]) BatchDelete(context *gin.Context, lookupKeys ...string) {
	filters := GetFiltersFromContext(context, lookupKeys...)
	var itemsToDelete []T
	if err := context.ShouldBindJSON(&itemsToDelete); err != nil {
		bc.RespondWithError(context, http.StatusBadRequest, err.Error())
		return
	}

	err := bc.Service.BatchDelete(filters, itemsToDelete)
	if err != nil {
		bc.RespondWithError(context, http.StatusInternalServerError, err.Error())
		return
	}

	bc.RespondWithJSON(context, http.StatusCreated, "")
}
