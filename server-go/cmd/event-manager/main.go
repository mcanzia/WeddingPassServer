package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"weddingpass/server/internal/dependencies"
	"weddingpass/server/internal/firebase"
	"weddingpass/server/internal/logger"
	"weddingpass/server/internal/router"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"go.uber.org/dig"
)

func main() {
	// Loading .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found; using environment variables")
	}

	// Firebase initialization
	ctx := context.Background()

	if err := firebase.InitFirebase(ctx); err != nil {
		log.Fatalf("Failed to initialize Firebase: %v", err)
	}

	// Setting up dependency injection
	container := dig.New()

	// Initialize database connection
	// container.Provide(database.ConnectDB())

	if err := dependencies.InitDependencies(container, ctx); err != nil {
		log.Fatalf("Failed to initialize dependencies: %v", err)
	}

	// Provide the router setup. Assume SetupRouter takes a pointer to Controllers.
	container.Provide(router.SetupRouter)

	// Invoke the function that starts the server.
	err := container.Invoke(startServer)
	if err != nil {
		log.Fatalf("Failed to invoke application: %v", err)
	}
}

func startServer(r *gin.Engine) error {
	if proxyErr := setupProxies(r); proxyErr != nil {
		return proxyErr
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "7500"
	}
	logger.Global.Info("Starting server on port " + port)
	if serverErr := r.Run(":" + port); serverErr != nil {
		return fmt.Errorf("failed to run server on port %s: %v", port, serverErr)
	}
	return nil
}

func setupProxies(r *gin.Engine) error {
	trustedProxies := os.Getenv("TRUSTED_PROXIES")
	proxies := []string{"127.0.0.1"}
	if trustedProxies != "" {
		extraProxies := strings.Split(trustedProxies, ",")
		proxies = append(proxies, extraProxies...)
	}
	if err := r.SetTrustedProxies(proxies); err != nil {
		return fmt.Errorf("failed to set trusted proxies: %v", err)
	}
	return nil
}
