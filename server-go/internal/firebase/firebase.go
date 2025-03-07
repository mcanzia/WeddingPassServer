package firebase

import (
	"context"
	"log"
	"os"

	"cloud.google.com/go/firestore"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/auth"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

var (
	FirebaseApp     *firebase.App
	FirestoreClient *firestore.Client
	AuthClient      *auth.Client
)

func InitFirebase(ctx context.Context) error {
	_ = godotenv.Load()

	nodeEnv := os.Getenv("ENV")
	var app *firebase.App
	var err error

	if nodeEnv == "test" {
		os.Setenv("FIRESTORE_EMULATOR_HOST", "localhost:8080")
		os.Setenv("FIREBASE_AUTH_EMULATOR_HOST", "localhost:9099")
		app, err = firebase.NewApp(ctx, &firebase.Config{
			ProjectID: "weddingpass-dev",
		})
		if err != nil {
			return err
		}
		log.Println("Firebase initialized in test mode")
	} else {
		serviceKey := os.Getenv("FIREBASE_SERVICE_ACCOUNT_KEY")
		var opts option.ClientOption
		if serviceKey != "" {
			opts = option.WithCredentialsJSON([]byte(serviceKey))
		} else {
			opts = option.WithCredentialsFile("../../internal/firebase/serviceAccountKey.json")
		}
		app, err = firebase.NewApp(ctx, nil, opts)
		if err != nil {
			return err
		}
		log.Println("Firebase initialized in production mode")
	}

	FirebaseApp = app

	fsClient, err := app.Firestore(ctx)
	if err != nil {
		return err
	}
	FirestoreClient = fsClient

	aClient, err := app.Auth(ctx)
	if err != nil {
		return err
	}
	AuthClient = aClient

	return nil
}
