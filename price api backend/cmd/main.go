package main

import (
	"encoding/json"
	"fmt"
	"github.com/spf13/viper"
	"io"
	"net/http"
	"template/internal/delivery"
	"template/internal/delivery/middleware"
	"template/internal/models"
	"template/pkg/config"
	"template/pkg/database"
	"template/pkg/log"
	"template/pkg/trace"
)

func getStorage(hostIP, hostPort string) *models.PreparedStorage {
	url := fmt.Sprintf("http://%v:%v/storage/current", hostIP, hostPort)
	resp, err := http.Get(url)
	if err != nil {
		return nil
	}
	defer resp.Body.Close()

	// Читаем тело ответа
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil
	}

	var str = string(body)

	_ = str

	if resp.StatusCode != 200 {
		fmt.Printf("error on initing storage %v", resp.StatusCode)
		return nil
	}

	// Десериализуем JSON в структуру
	var preparedStorage models.PreparedStorage
	if err := json.Unmarshal(body, &preparedStorage); err != nil {
		return nil
	}

	return &preparedStorage
}

func main() {
	logger, loggerInfoFile, loggerErrorFile := log.InitLogger()
	defer loggerInfoFile.Close()
	defer loggerErrorFile.Close()

	logger.Info("Logger Initialized")

	config.InitConfig()
	logger.Info("Config Initialized")

	serviceName := viper.GetString(config.ServiceName)

	jaegerURL := fmt.Sprintf("http://%v:%v/api/traces", viper.GetString(config.JaegerHost), viper.GetString(config.JaegerPort))
	tracer := trace.InitTracer(jaegerURL, serviceName)
	logger.Info("Tracer Initialized")

	db := database.GetDB()
	logger.Info("Database Initialized")

	//rdb := database.InitRedisSession()

	mdw := middleware.InitMiddleware(logger)

	initStorage := getStorage(viper.GetString(config.FatherHost), viper.GetString(config.FatherPort))

	storage := models.Storage{
		Current: initStorage,
		Next:    nil,
	}

	delivery.Start(
		db,
		logger,
		tracer,
		mdw,
		storage,
	)

}
