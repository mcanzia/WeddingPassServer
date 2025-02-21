package logger

import (
	"log/slog"
	"os"
)

var Global *slog.Logger

func init() {
	logFile, err := os.OpenFile("/pkg/logs/all.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		Global = slog.New(slog.NewTextHandler(os.Stdout, nil))
	} else {
		Global = slog.New(slog.NewTextHandler(logFile, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		}))
	}

	slog.SetDefault(Global)
}
