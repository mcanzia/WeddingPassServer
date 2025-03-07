package middleware

import (
	"log"
	"time"

	"github.com/gin-gonic/gin"
)

func LoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Record the start time.
		startTime := time.Now()

		// Process the request.
		c.Next()

		// Calculate the latency.
		latency := time.Since(startTime)

		// Get the HTTP status code.
		statusCode := c.Writer.Status()

		// Log the details.
		log.Printf("Method: %s | Path: %s | Status: %d | Latency: %v", c.Request.Method, c.Request.URL.Path, statusCode, latency)
	}
}
