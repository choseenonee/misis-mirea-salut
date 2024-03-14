package service

import (
	"fmt"
	"github.com/jmoiron/sqlx"
)

func initDB() *sqlx.DB {
	connString := fmt.Sprintf(
		"user=%v password=%v host=%v port=%v dbname=%v sslmode=disable",
		"postgres", "postgres", "localhost", "5432", "postgres",
	)
	db, err := sqlx.Connect("postgres", connString)
	if err != nil {
		panic(fmt.Sprintf("Error while connecting to DB. Error: %v", err.Error()))
	}

	return db
}

//func TestServiceStruct_GetPrice(t *testing.T) {
//	db := initDB()
//
//	repo := repository.InitRepository(db)
//
//	serv := InitService(repo, )
//}
