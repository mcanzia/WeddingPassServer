package database

import (
	"database/sql"
	"fmt"
)

func ConnectDB() (*sql.DB, error) {
	connStr := "user=youruser password=yourpassword dbname=yourdb sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("ConnectDB: %v", err)
	}
	return db, nil
}
