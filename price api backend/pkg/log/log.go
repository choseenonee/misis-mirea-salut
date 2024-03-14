package log

import (
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/rs/zerolog"
)

type Logs struct {
	infoLogger  *zerolog.Logger
	errorLogger *zerolog.Logger
}

func (l *Logs) Info(s string) {
	l.infoLogger.Info().Msg(s)
}

func (l *Logs) Error(s string) {
	l.errorLogger.Error().Msg(s)
}

func UnitFormatter() {
	zerolog.TimestampFunc = func() time.Time {
		format := "2006-01-02 15:04:05"
		timeString := time.Now().Format(format)
		timeFormatted, _ := time.Parse(format, timeString)
		return timeFormatted
	}

	zerolog.CallerMarshalFunc = func(pc uintptr, file string, line int) string {
		path := strings.Split(file, "Backend")
		return fmt.Sprintf("%routers:%d", fmt.Sprintf("Backend%routers", path[len(path)-1]), line)
	}
}

func InitLogger() (*Logs, *os.File, *os.File) {
	UnitFormatter()

	loggerInfoFile, err := os.OpenFile("log/info.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0660)
	if err != nil {
		panic("Error opening info log file")
	}

	loggerErrorFile, err := os.OpenFile("log/error.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0660)
	if err != nil {
		panic("Error opening error log file")
	}

	infoLogger := zerolog.New(loggerInfoFile).With().Timestamp().Caller().Logger()
	errorLogger := zerolog.New(loggerErrorFile).With().Timestamp().Caller().Logger()

	log := &Logs{
		infoLogger:  &infoLogger,
		errorLogger: &errorLogger,
	}

	return log, loggerInfoFile, loggerErrorFile
}
