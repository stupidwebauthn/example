package main

import (
	"log/slog"
	"net/http"
	"os"

	"github.com/dotenv-org/godotenvvault"
	"github.com/gin-gonic/gin"
	"github.com/stupidwebauthn/swa_sdk_go"
)

func main() {
	godotenvvault.Load()
	port := os.Getenv("PORT")
	if port == "" {
		slog.Error("port must be set")
		os.Exit(1)
	}

	slog.Info("Starting on port: " + port)

	swaBase := os.Getenv("SWA_BASE")
	if swaBase == "" {
		slog.Error("SWA_BASE environment variable must be set")
		os.Exit(1)
	}

	slog.Info("swa base: " + swaBase)

	swa := swa_sdk_go.NewStupidWebauthn(swaBase)

	r := gin.Default()

	rPrivate := r.Group("/api/data")
	rPrivate.Use(func(c *gin.Context) {
		header := c.Writer.Header()
		res, status, err := swa.AuthMiddleware(c.Request, &header)
		if err != nil {
			c.AbortWithError(status, err)
			return
		}
		c.Set("swa", res)
		c.Next()
	})
	rPrivate.GET("/", func(c *gin.Context) {
		rawAuth, _ := c.Get("swa")
		auth := rawAuth.(*swa_sdk_go.AuthResponse)

		c.JSON(http.StatusOK, auth)
	})

	r.GET("/api/", func(c *gin.Context) {
		c.String(http.StatusOK, "GoLang API Server")
	})

	r.Run("0.0.0.0:" + port)

}
