package middleware

import (
	"log"
	"net/http"
	"strings"
	"weddingpass/server/internal/firebase"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || !strings.HasPrefix(authHeader, "Bearer ") {
			log.Println("Authorization header missing or invalid")
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "User is not authorized to perform this action",
			})
			return
		}

		tokenString := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "User is not authorized to perform this action",
			})
			return
		}

		userDetails, err := firebase.AuthClient.VerifyIDToken(c, tokenString)
		if err != nil {
			log.Printf("Authorization attempt failed: %v", err)
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
				"error": "User is not authorized to perform this action",
			})
			return
		}

		userRole := c.GetHeader("User-Role")

		c.Set("userAuth", userDetails.UID)
		c.Set("userRole", userRole)

		c.Next()
	}
}
