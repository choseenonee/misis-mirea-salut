package config

import (
	"fmt"
	"github.com/spf13/viper"
	"os"
	"path/filepath"
)

const (
	DBName            = "DB_NAME"
	DBUser            = "DB_USER"
	DBPassword        = "DB_PASSWORD"
	DBPort            = "DB_PORT"
	DBHost            = "DB_HOST"
	TimeOut           = "TIME_OUT"
	JWTExpire         = "JWT_EXPIRE"
	Secret            = "SECRET"
	SessionExpiration = "SESSION_EXPIRATION"
	RedisHost         = "REDIS_HOST"
	RedisPassword     = "REDIS_PASSWORD"
	RedisPort         = "REDIS_PORT"
	JaegerHost        = "JAEGER_HOST"
	JaegerPort        = "JAEGER_PORT"
	MaxOnPage         = "MAX_ON_PAGE"
	ServiceName       = "SERVICE_NAME"
	FatherHost        = "FATHER_HOST"
	FatherPort        = "FATHER_PORT"
)

func InitConfig() {
	envPath, _ := os.Getwd()
	envPath = filepath.Join(envPath, "..")

	viper.SetConfigName(".env")
	viper.SetConfigType("env")
	viper.AddConfigPath(envPath)
	err := viper.ReadInConfig()

	if err != nil {
		panic(fmt.Sprintf("Failed to init config. Error:%v", err.Error()))
	}
}
