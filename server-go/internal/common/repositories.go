package common

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type BaseRepository[T Identifiable] struct {
	client *firestore.Client
	ctx    context.Context
	coll   *firestore.CollectionRef
}

func NewBaseRepository[T Identifiable](client *firestore.Client, ctx context.Context, coll *firestore.CollectionRef) BaseRepository[T] {
	return BaseRepository[T]{
		client: client,
		ctx:    ctx,
		coll:   coll,
	}
}

func (repository *BaseRepository[T]) Coll() *firestore.CollectionRef {
	return repository.coll
}

func (repository *BaseRepository[T]) Ctx() context.Context {
	return repository.ctx
}

func (repository BaseRepository[T]) GetAll(params map[string]string) ([]T, error) {
	docs, err := repository.coll.Documents(repository.ctx).GetAll()
	if err != nil {
		return nil, fmt.Errorf("GetAll: %w", err)
	}
	var entities []T
	for _, doc := range docs {
		var entity T
		if err := doc.DataTo(&entity); err != nil {
			return nil, fmt.Errorf("GetAll DataTo: %w", err)
		}
		entity.SetID(doc.Ref.ID)
		entities = append(entities, entity)
	}
	return entities, nil
}

func (repository BaseRepository[T]) GetByID(params map[string]string) (T, error) {
	id, ok := params["id"]
	if !ok || id == "" {
		var zero T
		return zero, NewCustomError(400, "GetByID: id not provided for lookup", nil)
	}
	doc, err := repository.coll.Doc(id).Get(repository.ctx)
	if err != nil {
		var zero T
		if status.Code(err) == codes.NotFound {
			return zero, NewCustomError(204, fmt.Sprintf("GetByID: no item found with id %s", id), err)
		}
		return zero, NewCustomError(500, "GetByID error", err)
	}
	var entity T
	if err := doc.DataTo(&entity); err != nil {
		var zero T
		return zero, NewCustomError(500, "GetByID: conversion error", err)
	}

	entity.SetID(doc.Ref.ID)

	return entity, nil
}

func (repository BaseRepository[T]) Save(params map[string]string, entity T) (T, error) {
	// id, ok := params["eventId"]
	// if !ok || id == "" {
	// 	var zero T
	// 	return zero, fmt.Errorf("GetByID: id not provided in filters")
	// }
	if entity.GetID() == "" {
		newRef := repository.coll.NewDoc()
		entity.SetID(newRef.ID)
		_, err := newRef.Set(repository.ctx, entity)
		if err != nil {
			var zero T
			return zero, fmt.Errorf("Save: %w", err)
		}
	} else {
		docRef := repository.coll.Doc(entity.GetID())
		_, err := docRef.Set(repository.ctx, entity)
		if err != nil {
			var zero T
			return zero, fmt.Errorf("Save (with provided ID): %w", err)
		}
	}
	return entity, nil
}

func (repository BaseRepository[T]) BatchCreate(params map[string]string, entities []T) error {
	bulkWriter := repository.client.BulkWriter(repository.ctx)
	defer bulkWriter.End()

	for _, entity := range entities {
		docRef := repository.coll.NewDoc()
		_, err := bulkWriter.Create(docRef, entity)
		if err != nil {
			return fmt.Errorf("failed to create document: %w", err)
		}
	}

	bulkWriter.Flush()
	return nil

}

// func (repository *BaseRepository[T]) Update(params map[string]string, entity T) (T, error) {
// 	docRef := repository.coll.Doc(entity.GetID())
// 	_, err := docRef.Set(repository.ctx, entity, firestore.MergeAll)
// 	if err != nil {
// 		var zero T
// 		return zero, fmt.Errorf("Update (Set MergeAll): %w", err)
// 	}
// 	return entity, nil
// }

func (repository *BaseRepository[T]) Delete(params map[string]string) error {
	id, ok := params["id"]
	if !ok || id == "" {
		return fmt.Errorf("Delete: id not provided in params")
	}
	doc, docRefError := repository.coll.Doc(id).Get(repository.ctx)
	if docRefError != nil {
		return fmt.Errorf("Delete: document not found: %w", docRefError)
	}
	_, deleteError := doc.Ref.Delete(repository.ctx)
	if deleteError != nil {
		return fmt.Errorf("Delete: %w", docRefError)
	}

	return nil
}

func (repository BaseRepository[T]) BatchDelete(params map[string]string, entities []T) error {
	bulkWriter := repository.client.BulkWriter(repository.ctx)
	defer bulkWriter.End()

	for _, entity := range entities {
		doc, fetchErr := repository.coll.Doc(entity.GetID()).Get(repository.ctx)
		if fetchErr != nil {
			return fmt.Errorf("failed to fetch document ref: %w", fetchErr)
		}
		docRef := doc.Ref
		_, deleteErr := bulkWriter.Delete(docRef)
		if deleteErr != nil {
			return fmt.Errorf("failed to delete document: %w", deleteErr)
		}
	}

	bulkWriter.Flush()
	return nil

}

func (repository BaseRepository[T]) GetSingleByField(params map[string]string) (T, error) {
	var zero T

	query := repository.Coll().Query
	for key, value := range params {
		if value != "" {
			query = query.Where(key, "==", value)
		}
	}
	query = query.Limit(1)

	iter := query.Documents(repository.Ctx())

	doc, err := iter.Next()
	if err == iterator.Done {
		return zero, fmt.Errorf("GetItemByField: no item found with this criteria")
	} else if err != nil {
		return zero, fmt.Errorf("GetItemByField: %w", err)
	}

	var entity T
	if err := doc.DataTo(&entity); err != nil {
		return zero, fmt.Errorf("GetItemByField DataTo: %w", err)
	}

	entity.SetID(doc.Ref.ID)
	return entity, nil
}

func (repository BaseRepository[T]) GetMultiByField(params map[string]string) ([]T, error) {
	query := repository.Coll().Query
	for key, value := range params {
		if value != "" {
			query = query.Where(key, "==", value)
		}
	}
	query = query.Limit(1)

	docs, err := query.Documents(repository.Ctx()).GetAll()
	if err != nil {
		return nil, fmt.Errorf("GetMultipleItemsByField: could not retrieve items for this criteria: %w", err)
	}

	if len(docs) == 0 {
		return []T{}, nil
	}

	var entities []T
	for _, doc := range docs {
		var entity T
		if err := doc.DataTo(&entity); err != nil {
			return nil, fmt.Errorf("GetMultipleItemsByField: failed to parse data: %w", err)
		}
		entity.SetID(doc.Ref.ID)
		entities = append(entities, entity)
	}
	return entities, nil
}
