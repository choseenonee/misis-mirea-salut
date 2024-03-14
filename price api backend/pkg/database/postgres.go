package database

import (
	"fmt"
	"github.com/jmoiron/sqlx"
	"github.com/spf13/viper"
	"github.com/uptrace/opentelemetry-go-extra/otelsql"
	"github.com/uptrace/opentelemetry-go-extra/otelsqlx"
	"template/pkg/config"

	_ "github.com/lib/pq"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
)

func GetDB() *sqlx.DB {
	connString := fmt.Sprintf(
		"user=%v password=%v host=%v port=%v dbname=%v sslmode=disable",
		viper.GetString(config.DBUser),
		viper.GetString(config.DBPassword),
		viper.GetString(config.DBHost),
		viper.GetInt(config.DBPort),
		viper.GetString(config.DBName),
	)

	//db, err := otelsql.Open("postgres", connString, otelsql.WithAttributes(
	//	semconv.DBSystemMySQL,
	//))

	db, err := otelsqlx.Open("postgres", connString,
		otelsql.WithAttributes(semconv.DBSystemSqlite))
	if err != nil {
		panic(fmt.Sprintf("Error while connecting to DB. Error: %v", err.Error()))
	}

	return db
}
