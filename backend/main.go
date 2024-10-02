package main

import (
	"fmt"
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
		res, status, err := swa.Middleware(c.Request)
		if err != nil {
			if status == http.StatusUnauthorized {
				swa.RemoveAuthCookie(c.Writer)
			}
			switch status {
			case http.StatusNotFound, http.StatusMovedPermanently:
				message := "Unable to connect to auth server"
				c.Error(fmt.Errorf("%d: %s %s", status, message, swaBase))
				c.String(http.StatusInternalServerError, message)
				c.Abort()
				return
			default:
				c.Status(status)
			}
			c.Error(err)
			c.Abort()
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
