package common

import (
	"context"
	"fmt"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
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

func (repository *BaseRepository[T]) buildFirestoreQuery(params map[string]string) firestore.Query {
	query := repository.Coll().Query
	for key, value := range params {
		if value != "" {
			query = query.Where(key, "==", value)
		}
	}
	return query
}

func (repository BaseRepository[T]) GetAll(params map[string]string) ([]T, *CustomError) {
	query := repository.buildFirestoreQuery(params)
	docs, err := query.Documents(repository.Ctx()).GetAll()
	if err != nil {
		return nil, NewCustomError(500, "Error Fetching Documents", err)
	}
	var entities []T
	for _, doc := range docs {
		entity, err := repository.TransformDocument(doc)
		if err != nil {
			return nil, err
		}
		entities = append(entities, entity)
	}
	return entities, nil
}

func (repository BaseRepository[T]) GetByID(params map[string]string) (T, *CustomError) {
	// id, ok := params["id"]
	// if !ok || id == "" {
	// 	var zero T
	// 	return zero, NewCustomError(400, "GetByID: id not provided for lookup", nil)
	// }
	query := repository.buildFirestoreQuery(params).Limit(1)
	iter := query.Documents(repository.Ctx())

	doc, err := iter.Next()
	var zero T
	if err == iterator.Done {
		return zero, NewCustomError(204, fmt.Sprintf("GetByID: no item found with id %s", params["id"]), err)
	} else if err != nil {
		return zero, NewCustomError(500, "GetByID error", err)
	}

	entity, transformErr := repository.TransformDocument(doc)
	if transformErr != nil {
		return zero, transformErr
	}

	return entity, nil
}

func (repository BaseRepository[T]) Save(params map[string]string, entity T) (T, *CustomError) {
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
			return zero, NewCustomError(500, "failed to create document", err)
		}
	} else {
		docRef := repository.coll.Doc(entity.GetID())
		_, err := docRef.Set(repository.ctx, entity)
		if err != nil {
			var zero T
			return zero, NewCustomError(500, "failed to update document", err)
		}
	}
	return entity, nil
}

func (repository BaseRepository[T]) BatchCreate(params map[string]string, entities []T) *CustomError {
	bulkWriter := repository.client.BulkWriter(repository.ctx)
	defer bulkWriter.End()

	for _, entity := range entities {
		docRef := repository.coll.NewDoc()
		entity.SetID(docRef.ID)
		_, err := bulkWriter.Create(docRef, entity)
		if err != nil {
			return NewCustomError(500, "failed to create document", err)
		}
	}

	bulkWriter.Flush()
	return nil

}

// func (repository *BaseRepository[T]) Update(params map[string]string, entity T) (T, *CustomError) {
// 	docRef := repository.coll.Doc(entity.GetID())
// 	_, err := docRef.Set(repository.ctx, entity, firestore.MergeAll)
// 	if err != nil {
// 		var zero T
// 		return zero, fmt.Errorf("Update (Set MergeAll): %w", err)
// 	}
// 	return entity, nil
// }

func (repository *BaseRepository[T]) Delete(params map[string]string) *CustomError {
	id, ok := params["id"]
	if !ok || id == "" {
		return NewCustomError(400, "Delete: id not provided in params", nil)
	}
	doc, docRefError := repository.coll.Doc(id).Get(repository.ctx)
	if docRefError != nil {
		return NewCustomError(500, "delete document not found", docRefError)
	}
	_, deleteError := doc.Ref.Delete(repository.ctx)
	if deleteError != nil {
		return NewCustomError(500, "failed to delete document", deleteError)
	}

	return nil
}

func (repository BaseRepository[T]) BatchDelete(params map[string]string, entities []T) *CustomError {
	bulkWriter := repository.client.BulkWriter(repository.ctx)
	defer bulkWriter.End()

	for _, entity := range entities {
		doc, fetchErr := repository.coll.Doc(entity.GetID()).Get(repository.ctx)
		if fetchErr != nil {
			return NewCustomError(500, "failed to fetch document ref", fetchErr)
		}
		docRef := doc.Ref
		_, deleteErr := bulkWriter.Delete(docRef)
		if deleteErr != nil {
			return NewCustomError(500, "failed to delete document", deleteErr)
		}
	}

	bulkWriter.Flush()
	return nil

}

func (repository BaseRepository[T]) GetSingleByField(params map[string]string) (T, *CustomError) {
	var zero T

	query := repository.buildFirestoreQuery(params).Limit(1)

	iter := query.Documents(repository.Ctx())

	doc, err := iter.Next()
	if err == iterator.Done {
		return zero, NewCustomError(201, "GetItemByField: no item found with this criteria", err)
	} else if err != nil {
		return zero, NewCustomError(500, "GetItemByField: no item found with this criteria", err)
	}

	entity, transformErr := repository.TransformDocument(doc)
	if transformErr != nil {
		return zero, NewCustomError(500, "Error Transforming Document", transformErr)
	}
	return entity, nil
}

func (repository BaseRepository[T]) GetMultiByField(params map[string]string) ([]T, *CustomError) {
	query := repository.buildFirestoreQuery(params)
	docs, err := query.Documents(repository.Ctx()).GetAll()
	if err != nil {
		return nil, NewCustomError(500, "GetMultipleItemsByField: could not retrieve items for this criteria", err)
	}

	if len(docs) == 0 {
		return []T{}, nil
	}

	var entities []T
	for _, doc := range docs {
		entity, err := repository.TransformDocument(doc)
		if err != nil {
			return nil, err
		}
		entities = append(entities, entity)
	}
	return entities, nil
}

func (repository BaseRepository[T]) CustomGetAllQuery(query firestore.Query) ([]T, *CustomError) {
	docs, err := query.Documents(repository.Ctx()).GetAll()
	if err != nil {
		return nil, NewCustomError(400, "error querying documents from db", err)
	}
	var entities []T
	for _, doc := range docs {
		entity, err := repository.TransformDocument(doc)
		if err != nil {
			return nil, err
		}
		entities = append(entities, entity)
	}
	return entities, nil
}

func (repository BaseRepository[T]) TransformDocument(doc *firestore.DocumentSnapshot) (T, *CustomError) {
	var entity T
	if err := doc.DataTo(&entity); err != nil {
		return entity, NewCustomError(500, "error transforming documents to data type", err)
	}
	entity.SetID(doc.Ref.ID)
	return entity, nil
}
